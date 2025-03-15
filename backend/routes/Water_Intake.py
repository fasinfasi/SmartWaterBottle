from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity

water_intake_bp = Blueprint('water_intake_bp', __name__)

# Base water intake recommendations in liters
base_men = 3.7
base_women = 2.7

# Age-based adjustments (in liters)
def age_adjustment(age, sex):
    if age <= 3:
        return 1.3
    elif 4 <= age <= 8:
        return 1.7
    elif 9 <= age <= 13:
        return 2.1 if sex == "Female" else 2.4
    elif 14 <= age <= 18:
        return 2.3 if sex == "Female" else 3.3
    else:
        return 0

# Weight-based adjustments (in liters, 30 ml per kg of body weight)
def weight_adjustment(weight):
    return weight * 0.03  # Adjust for weight (liters)

# Activity level adjustments (in liters)
def activity_adjustment(activity_level):
    adjustments = {
        "Low": 0.0,
        "Moderate": 0.5,
        "High": 1.0
    }
    return adjustments.get(activity_level, 0.0)

# Health condition adjustments (in liters)
def health_adjustment(health_condition):
    adjustments = {
        "Kidney Stones": 0.5,
        "Diabetes": 0.5,
        "Pregnancy": 0.3,
        "Breastfeeding": 0.7,
        "Liver Disease": -0.5,   # Decrease intake
        "Dialysis": -0.7,        # Decrease intake
        "None": 0.0              # No adjustment
    }
    return adjustments.get(health_condition, 0.0)

# Function to calculate the total daily water intake in milliliters
def calculate_water_intake(sex, age, weight, activity_level, health_condition):
    base = base_men if sex == "Male" else base_women

    # Apply adjustments
    age_adj = age_adjustment(age, sex)
    weight_adj = weight_adjustment(weight)
    activity_adj = activity_adjustment(activity_level)
    health_adj = health_adjustment(health_condition)

    # Calculate total water intake (in liters)
    total_intake_liters = base + age_adj + weight_adj + activity_adj + health_adj

    # Convert to milliliters
    total_intake_ml = total_intake_liters * 1000  # Convert liters to milliliters
    return round(total_intake_ml, 2)

# API endpoint for calculating daily water intake based on user input
@water_intake_bp.route('/calculate-water-intake', methods=['GET'])
@jwt_required()
def calculate_water():
    try:
        # Get current user identity
        current_user = get_jwt_identity()

        # Get database connection
        mongo = current_app.mongo
        db = mongo.db
        client_collection = db.Client_Details

        # Retrieve user details from database
        user_data = client_collection.find_one({"user_id": current_user})
        if not user_data:
            return jsonify({'error': 'User not found'}), 404

        # Extract necessary fields from the user data
        sex = user_data.get('sex', '').capitalize()
        age = float(user_data.get('age', 0)) if user_data.get('age') else 0
        weight = float(user_data.get('weight', 0)) if user_data.get('weight') else 0
        activity_level = user_data.get('activity_level', '')
        health_condition = user_data.get('health_condition', '')

        # Calculate water intake
        total_intake = calculate_water_intake(sex, age, weight, activity_level, health_condition)

        # Return the calculated water intake as the response
        return jsonify({'targetWaterConsumption': total_intake}), 200

    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500
