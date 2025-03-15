from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

sleep_time_bp = Blueprint('sleep_time', __name__)

# Helper function to convert 12hr format to 24hr format
def convert_to_24hr_format(time_str, time_format):
    try:
        if time_format == '12hr':
            # Convert 12hr to 24hr format
            time_obj = datetime.strptime(time_str, '%I:%M %p')  # %I is for 12-hour format with AM/PM
            return time_obj.strftime('%H:%M')  # Return in 24-hour format
        else:
            return time_str  # Already in 24hr format
    except ValueError:
        return None

@sleep_time_bp.route('/submit_sleep_time', methods=['POST'])
@jwt_required()
def submit_sleep_time():
    try:
        # Access MongoDB through current_app
        mongo = current_app.mongo
        db = mongo.db
        collection = db.Client_Details

        # Parse incoming data
        data = request.get_json()
        start_time = data.get('from', '').strip()
        end_time = data.get('to', '').strip()
        time_format = data.get('time_format', '').strip()

        # Validate input data
        if not start_time or not end_time:
            return jsonify({'status': 'error', 'message': 'Both start and end times are required'}), 400

        if time_format not in ['12hr', '24hr']:
            return jsonify({'status': 'error', 'message': 'Invalid time format. Must be "12hr" or "24hr".'}), 400
        
        # Convert times to 24hr format if the provided time is in 12hr format
        start_time_24hr = convert_to_24hr_format(start_time, time_format)
        end_time_24hr = convert_to_24hr_format(end_time, time_format)

        if not start_time_24hr or not end_time_24hr:
            return jsonify({'status': 'error', 'message': 'Invalid time format. Please use HH:MM or 12-hour with AM/PM.'}), 400

        # Get user email from JWT
        email = get_jwt_identity()
        print(f"JWT Identity: {email}")  # Debug log

        # Check if user exists in the database
        user = collection.find_one({'user_id': email})
        if not user:
            print(f"User not found for user_id: {email}")  # Debug log
            return jsonify({'status': 'error', 'message': 'User not found'}), 404

        # Create sleep data object to be saved (store only one time format)
        sleep_data = {}

        if time_format == '12hr':
            sleep_data['start_time'] = start_time  # Store in 12hr format
            sleep_data['end_time'] = end_time      # Store in 12hr format
        else:
            sleep_data['start_time'] = start_time_24hr  # Store in 24hr format
            sleep_data['end_time'] = end_time_24hr      # Store in 24hr format
        
        # Store the time format used by the user
        sleep_data['time_format'] = time_format

        # Update the user's sleep time and time format in the database
        result = collection.update_one(
            {'user_id': email},
            {'$set': {'sleep_time': sleep_data}}
        )
        print(f"Update result: {result.modified_count}")  # Debug log

        if result.modified_count == 0:
            return jsonify({'status': 'success', 'message': 'No changes made'}), 200

        return jsonify({'status': 'success', 'message': 'Sleep time and time format updated successfully'}), 200

    except Exception as e:
        current_app.logger.error(f"Error in submit_sleep_time: {e}")
        return jsonify({'status': 'error', 'message': 'Internal server error'}), 500
