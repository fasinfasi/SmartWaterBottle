from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import matplotlib.pyplot as plt
import io
import base64
import numpy as np  # For calculating mean and standard deviation

# Create a blueprint
analysis_bp = Blueprint('analysis_bp', __name__)

# Mapping ratings to numerical values for y-axis visualization
rating_map = {
    "Outstanding": 4,
    "Excellent": 3,
    "Good": 2,
    "Average": 1,
    "Missed": 0
}

@analysis_bp.route('/analyze', methods=['POST'])
@jwt_required()
def analyze():
    # Get the current user's ID from the JWT token
    user_id = get_jwt_identity()

    # Get the JSON data from the request body
    data = request.get_json()

    # Extract the two dates from the request
    date1 = data.get('date1')
    date2 = data.get('date2')

    # Ensure both dates are provided; return an error if missing
    if not date1 or not date2:
        return jsonify({"error": "Please provide both 'date1' and 'date2' in the request body"}), 400

    # Access the existing MongoDB connection from app.py
    mongo = current_app.mongo
    db = mongo.db
    collection = db.Hydration_Record  # Correct collection name

    # Query MongoDB for records matching the specified dates and user_id
    records1 = collection.find_one({"user_id": user_id, "current_date": date1})
    records2 = collection.find_one({"user_id": user_id, "current_date": date2})

    # Check if records exist for the given dates
    if not records1 or not records2:
        return jsonify({"error": f"No records found for one or both dates: {date1}, {date2}"}), 404

    # Extract x (Scheduled Time) and y (Rating) values for both dates
    x_values_date1 = []
    y_values_date1 = []
    for record in records1.get('records', []):
        x_values_date1.append(record['scheduled_time'])
        y_values_date1.append(rating_map.get(record['rating'], 0))  # Default to 0 if rating not found

    x_values_date2 = []
    y_values_date2 = []
    for record in records2.get('records', []):
        x_values_date2.append(record['scheduled_time'])
        y_values_date2.append(rating_map.get(record['rating'], 0))  # Default to 0 if rating not found

    # Calculate mean and standard deviation for each date
    mean1 = np.mean(y_values_date1)
    sd1 = np.std(y_values_date1)

    mean2 = np.mean(y_values_date2)
    sd2 = np.std(y_values_date2)

    # Calculate CoSD for both dates
    cosd1 = (sd1 / mean1) * 100 if mean1 != 0 else 0  # Avoid division by zero
    cosd2 = (sd2 / mean2) * 100 if mean2 != 0 else 0

    # Determine feedback based on averages and CoSD
    feedback = f"Comparison for {date1} vs {date2}:\n"
    feedback += f"Average of Date1: {int(mean1)}/4\n"
    feedback += f"Average of Date2: {int(mean2)}/4\n"

    # Get the ratings based on mean
    rating_date1 = get_rating(mean1)
    rating_date2 = get_rating(mean2)

    # Feedback logic for improvement, consistency, or decline
    if int(mean1) < int(mean2):
        feedback += f"Fantastic! You've improved your hydration from a **{rating_date1}** level to an **{rating_date2}** level. This means you've been drinking more consistently throughout the day and keeping your hydration levels high."
    elif int(mean1) == int(mean2):
        feedback += f"Great job! Your hydration level has remained consistent at **{rating_date1}**."
    else:  # mean1 > mean2
        feedback += f"Your hydration performance has declined from **{rating_date1}** to **{rating_date2}**."

    # Add CoSD comparison (simplified for end users)
    if cosd1 < cosd2:
        feedback += "However, the consistency of ratings decreased on Date2, meaning there was more variation in the ratings.\n"
    elif cosd1 == cosd2:
        feedback += "Consistency remained the same between the two dates, with similar levels of variation in both sets of ratings.\n"
    else:
         feedback += "Consistency improved on Date2, meaning the ratings were more consistent (less variation) compared to Date1.\n"

    

   

  
    

    # Return the results as a JSON response
    return jsonify({
        'date1': date1,
        'date2': date2,
        'feedback': feedback
    })



def get_rating(mean):
    """Get the rating based on the average points."""
    if mean >= 4:
        return "Outstanding"
    elif mean >= 3:
        return "Excellent"
    elif mean >= 2:
        return "Good"
    elif mean >= 1:
        return "Average"
    else:
        return "Missed"
    
@analysis_bp.route('/fetch_ratings', methods=['POST'])
@jwt_required()
def fetch_ratings():
    """Fetch scheduled time and rating for two selected dates."""
    user_id = get_jwt_identity()
    data = request.get_json()

    date1 = data.get('date1')
    date2 = data.get('date2')

    if not date1 or not date2:
        return jsonify({"error": "Please provide both 'date1' and 'date2' in the request body"}), 400

    # Access MongoDB
    mongo = current_app.mongo
    db = mongo.db
    collection = db.Hydration_Record

    # Fetch records for both dates
    record1 = collection.find_one({"user_id": user_id, "current_date": date1})
    record2 = collection.find_one({"user_id": user_id, "current_date": date2})

    if not record1 or not record2:
        return jsonify({"error": f"No records found for one or both dates: {date1}, {date2}"}), 404

    # Ensure that records exist and are in the correct format
    records_date1 = record1.get('records', [])
    records_date2 = record2.get('records', [])

    # If records are empty, return empty lists
    if not records_date1 or not records_date2:
        return jsonify({
            "error": "No records found for the selected dates"
        }), 404

    # Extract scheduled time and ratings
    x_values_date1 = [entry['scheduled_time'] for entry in records_date1]
    y_values_date1 = [rating_map.get(entry['rating'], 0) for entry in records_date1]

    x_values_date2 = [entry['scheduled_time'] for entry in records_date2]
    y_values_date2 = [rating_map.get(entry['rating'], 0) for entry in records_date2]

    return jsonify({
        "date1": date1,
        "scheduled_time_date1": x_values_date1,
        "ratings_date1": y_values_date1,
        "date2": date2,
        "scheduled_time_date2": x_values_date2,
        "ratings_date2": y_values_date2
    })