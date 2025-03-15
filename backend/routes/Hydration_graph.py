from flask import Flask, Blueprint, request, jsonify, current_app
from datetime import datetime
import matplotlib.pyplot as plt
import numpy as np
import io
import base64
from flask_jwt_extended import jwt_required, get_jwt_identity

hydration_graph_bp = Blueprint('hydration_graph_bp', __name__)

# Map ratings to numeric values for plotting
rating_map = {
    "Missed": 0,
    "Average": 1,
    "Good": 2,
    "Excellent": 3,
    "Outstanding": 4
}

# Reverse map for the frontend to show rating labels
reverse_rating_map = {v: k for k, v in rating_map.items()}

# Function to calculate rating based on time difference and amount consumed
def calculate_rating(scheduled_time, actual_time, amount):
    # Check if the amount of water consumed is at least 80ml
    if amount < 80:
        return "Missed"
    
    # Parse time strings into datetime objects
    scheduled = datetime.strptime(scheduled_time, "%H:%M")
    actual = datetime.strptime(actual_time, "%H:%M")
    
    # Calculate time difference in minutes
    time_diff = abs((actual - scheduled).total_seconds()) / 60

    # Determine rating based on time difference
    if time_diff <= 5:
        return "Outstanding"
    elif time_diff <= 10:
        return "Excellent"
    elif time_diff <= 20:
        return "Good"
    elif time_diff <= 30:
        return "Average"
    else:
        return "Missed"

# API endpoint to update hydration data
@hydration_graph_bp.route('/update_hydration', methods=['POST'])
@jwt_required()
def update_hydration():
    user_id = get_jwt_identity()
    mongo = current_app.mongo
    db = mongo.db
    collection = db.Hydration_Record

    # Get data from the request
    data = request.json
    scheduled_time = data.get('scheduled_time')
    actual_time = data.get('actual_time')
    amount = data.get('amount')
    current_date = datetime.now().strftime("%Y-%m-%d")

    if not (scheduled_time and actual_time and amount):
        return jsonify({"error": "Missing required fields."}), 400

    # Calculate rating
    rating = calculate_rating(scheduled_time, actual_time, amount)

    # Update or insert the record
    collection.update_one(
        {"user_id": user_id, "current_date": current_date, "records.scheduled_time": scheduled_time},
        {"$set": {
            "records.$.actual_time": actual_time,
            "records.$.amount": amount,
            "records.$.rating": rating
        }},
        upsert=True
    )

    return jsonify({"message": "Hydration record updated successfully", "rating": rating}), 200

# Function to generate the hydration graph using Matplotlib and NumPy
def generate_hydration_graph(times, ratings):
    y_values = [rating_map.get(rating, 0) for rating in ratings]
    x_values = np.arange(len(times))

    plt.figure(figsize=(12, 6))
    plt.plot(x_values, y_values, marker='o', linestyle='-', color='b', label="Hydration Rating")
    plt.xticks(x_values, times, rotation=45, ha="right", fontsize=10)
    plt.yticks(list(rating_map.values()), list(rating_map.keys()), fontsize=10)
    plt.xlabel("Scheduled Time", fontsize=12)
    plt.ylabel("Rating", fontsize=12)
    plt.title("Daily Hydration Ratings", fontsize=14)
    plt.grid(True, linestyle='--', alpha=0.7)
    plt.tight_layout()

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)

    graph_base64 = base64.b64encode(buffer.read()).decode('utf-8')
    buffer.close()
    plt.close()

    return graph_base64

# API endpoint to fetch hydration graph data
@hydration_graph_bp.route('/get_hydration_graph', methods=['GET'])
@jwt_required()
def get_hydration_graph():
    user_id = get_jwt_identity()
    mongo = current_app.mongo
    db = mongo.db
    collection = db.Hydration_Record

    current_date = datetime.now().strftime("%Y-%m-%d")
    hydration_record = collection.find_one({"user_id": user_id, "current_date": current_date})

    if not hydration_record:
        return jsonify({"error": "No hydration data found for today."}), 404

    # Extract scheduled times and ratings from the record
    records = hydration_record.get('records', [])
    times = [record['scheduled_time'] for record in records]
    ratings = [record['rating'] for record in records]

    # Generate the graph as a base64 image
   

    # Return times, ratings, and the graph as a base64 image
    return jsonify({
        "times": times,
        "ratings": ratings,
       
    }), 200
