from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity

# Create a blueprint
edit_profile_bp = Blueprint('edit_profile', __name__)

# Route to edit the user's profile
@edit_profile_bp.route('/edit_profile', methods=['POST'])
@jwt_required()
def edit_profile():
    # Get the current user's email from the JWT
    email = get_jwt_identity()

    # Get data from the request
    data = request.json
    name = data.get('name')
    age = data.get('age')
    sex = data.get('sex')
    weight = data.get('weight')
    activity_level = data.get('activityLevel')
    health_condition = data.get('healthCondition')

    # Validation
    if not all([name, age, sex, activity_level, health_condition]):
        return jsonify({"msg": "Please fill out all fields"}), 400

    # Access MongoDB collection
    mongo = current_app.mongo
    db = mongo.db
    collection = db.Client_Details

    # Update the user's profile in the database
    result = collection.update_one(
        {"user_id": email},  # Use user_id (email) to identify the user
        {"$set": {
            "name": name,
            "age": age,
            "sex": sex,
            "weight": weight,
            "activity_level": activity_level,
            "health_condition": health_condition
        }}
    )

    if result.matched_count > 0:
        return jsonify({"msg": "Profile updated successfully"}), 200
    else:
        return jsonify({"msg": "User not found"}), 404

# Route to fetch the user's profile
@edit_profile_bp.route('/get_profile', methods=['GET'])
@jwt_required()
def get_profile():
    # Get the current user's email from the JWT
    email = get_jwt_identity()

    # Access MongoDB collection
    mongo = current_app.mongo
    db = mongo.db
    collection = db.Client_Details

    # Retrieve the user's profile from the database
    user_profile = collection.find_one({"user_id": email}, {"_id": 0})  # Exclude MongoDB `_id` field

    if user_profile:
        return jsonify(user_profile), 200
    else:
        return jsonify({"msg": "User not found"}), 404
