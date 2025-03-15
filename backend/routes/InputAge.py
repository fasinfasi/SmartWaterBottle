from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timezone
from apscheduler.schedulers.background import BackgroundScheduler
import atexit

input_age_bp = Blueprint('input_age_bp', __name__)

# Helper function to calculate age from date of birth
def calculate_age(day, month, year):
    today = datetime.now(timezone.utc)  # Get today's date in UTC
    birth_date = datetime(year, month, day, tzinfo=timezone.utc)  # Ensure birth_date is also in UTC
    age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
    return age

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

@input_age_bp.route('/update_dob', methods=['POST'])
@jwt_required()
def update_dob():
    # Get the current user email from the JWT token
    user_email = get_jwt_identity()

    # Get the JSON data from the request
    dob_data = request.json
    day = dob_data.get('day')
    month = dob_data.get('month')
    year = dob_data.get('year')

    # Validate input data
    if not (day and month is not None and year):
        return jsonify({"error": "Invalid input"}), 400

    # Calculate age based on the date of birth
    age = calculate_age(day, month, year)

    # Create the date of birth object
    dob = {
        "day": day,
        "month": month,
        "year": year
    }

    # Access MongoDB via current_app (as you want it to be)
    mongo = current_app.mongo
    db = mongo.db
    collection = db.Client_Details

    # Retrieve the user's sex from the database
    user = collection.find_one({"email": user_email}, {"sex": 1})

    # Check if the user was found and has a valid sex attribute
    if not user or 'sex' not in user:
        return jsonify({"error": "User not found or sex not set"}), 404

    sex = user['sex']
    
    # Calculate age-based adjustment using age and sex
    water_intake_adjustment = age_adjustment(age, sex)

    # Update the user record in MongoDB with date_of_birth, age, and age_adjustment
    update_result = collection.update_one(
        {"email": user_email},  # Use the email as the identifier
        {"$set": {"age": age}}
    )

    # Check if the user was found and updated
    if update_result.matched_count == 0:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "message": "Date of Birth, Age, and Age-based adjustment updated successfully!",
        "age": age,
        "age_adjustment": water_intake_adjustment
    }), 200

# Function to automatically update ages for users with today's birthday
def update_ages():
    today = datetime.now(timezone.utc)
    today_day = today.day
    today_month = today.month

    # Access MongoDB via current_app (as you want it to be)
    mongo = current_app.mongo
    db = mongo.db
    collection = db.Client_Details

    # Find users whose birthday matches today's date
    users = collection.find({"date_of_birth.day": today_day, "date_of_birth.month": today_month})

    for user in users:
        dob = user['date_of_birth']
        birth_date = datetime(dob['year'], dob['month'], dob['day'], tzinfo=timezone.utc)
        age = calculate_age(birth_date.day, birth_date.month, birth_date.year)

        # Update the user's age in the database
        collection.update_one(
            {"_id": user['_id']},
            {"$set": {"age": age}}
        )
        print(f"Updated age for {user['email']} to {age}")

# Scheduler setup (ensure to import this in app.py)
scheduler = BackgroundScheduler(timezone='UTC')
scheduler.add_job(update_ages, 'interval', days=1)  # Run every day
scheduler.start()

# Ensure the scheduler is shut down properly when the app stops
atexit.register(lambda: scheduler.shutdown())
