from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import re
from datetime import datetime

settings_bp = Blueprint('settings_bp', __name__)

# Validate time format (HH:MM)
def is_valid_time_format(time_str):
    return re.match(r'^([01]?[0-9]|2[0-3]):[0-5][0-9]$', time_str) is not None

# Convert 12-hour format to 24-hour format
def convert_to_24hr_format(time_str):
    try:
        return datetime.strptime(time_str, '%I:%M %p').strftime('%H:%M')
    except ValueError:
        return None

# Convert 24-hour format to 12-hour format
def convert_to_12hr_format(time_str):
    try:
        return datetime.strptime(time_str, '%H:%M').strftime('%I:%M %p')
    except ValueError:
        return None

# Save sleep time
@settings_bp.route('/setting/sleep-time', methods=['POST'])
@jwt_required()
def save_sleep_time():
    user_id = get_jwt_identity()  # Get the current user's ID from the JWT token
    data = request.json
    sleep_from = data.get('start_time')
    sleep_to = data.get('end_time')

    # Validate input times
    if not is_valid_time_format(sleep_from) or not is_valid_time_format(sleep_to):
        return jsonify({"error": "Invalid time format. Time should be in HH:MM format."}), 400

    # Get the user's preferred time format (12hr or 24hr)
    mongo = current_app.mongo
    db = mongo.db
    collection = db.Client_Details
    user = collection.find_one({'user_id': user_id})

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Get user's time format preference (default to 24hr if not set)
    time_format = user.get('sleep_time', {}).get('time_format', '24hr')

    # Convert times based on the user's preference
    if time_format == '12hr':
        start_time = convert_to_12hr_format(sleep_from)
        end_time = convert_to_12hr_format(sleep_to)
    else:
        start_time = sleep_from
        end_time = sleep_to

    # Check if conversion was successful
    if not start_time or not end_time:
        return jsonify({"error": "Failed to convert time formats."}), 400

    sleep_time = {
        "start_time": start_time,
        "end_time": end_time,
        "time_format": time_format  # Store only the selected time format
    }

    try:
        # Update the sleep_time in the database
        result = collection.update_one({'user_id': user_id}, {'$set': {'sleep_time': sleep_time}})
        
        if result.matched_count == 0:
            return jsonify({"error": "No user found to update sleep time"}), 404

        return jsonify({"message": "Sleep time updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to update sleep time: {str(e)}"}), 500


# Get sleep time
@settings_bp.route('/setting/sleep-time', methods=['GET'])
@jwt_required()
def get_sleep_time():
    user_id = get_jwt_identity()

    try:
        mongo = current_app.mongo
        db = mongo.db
        collection = db.Client_Details
        user = collection.find_one({'user_id': user_id})

        if user and 'sleep_time' in user:
            sleep_time = user['sleep_time']
            return jsonify({
                "start_time": sleep_time["start_time"],
                "end_time": sleep_time["end_time"],
                "time_format": sleep_time["time_format"]
            }), 200
        
        return jsonify({"message": "Sleep time not found"}), 404
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve sleep time: {str(e)}"}), 500


# Save time format
@settings_bp.route('/setting/time-format', methods=['POST'])
@jwt_required()
def save_time_format():
    user_id = get_jwt_identity()
    data = request.json
    time_format = data.get('timeFormat')

    if time_format not in ['12hr', '24hr']:
        return jsonify({"error": "Invalid time format. Must be '12hr' or '24hr'."}), 400

    try:
        mongo = current_app.mongo
        db = mongo.db
        collection = db.Client_Details
        collection.update_one({'user_id': user_id}, {'$set': {'sleep_time.time_format': time_format}})
        return jsonify({"message": "Time format updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to update time format: {str(e)}"}), 500


# Get time format
@settings_bp.route('/setting/time-format', methods=['GET'])
@jwt_required()
def get_time_format():
    user_id = get_jwt_identity()

    try:
        mongo = current_app.mongo
        db = mongo.db
        collection = db.Client_Details
        user = collection.find_one({'user_id': user_id})
        if user and 'sleep_time' in user:
            return jsonify({'time_format': user['sleep_time'].get('time_format', '24hr')}), 200
        return jsonify({"message": "Time format not found"}), 404
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve time format: {str(e)}"}), 500
