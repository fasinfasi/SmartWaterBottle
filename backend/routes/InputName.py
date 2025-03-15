from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity

input_name_bp = Blueprint('input_name', __name__)

@input_name_bp.route('/submit_name', methods=['POST'])
@jwt_required()
def submit_name():
    try:
        # Access MongoDB through current_app
        mongo = current_app.mongo
        db = mongo.db
        collection = db.Client_Details

        # Parse incoming data
        data = request.get_json()
        name = data.get('name', '').strip()
        sex = data.get('sex', '').strip()

        if not name:
            return jsonify({'status': 'error', 'message': 'Name is required'}), 400
        if sex not in ['male', 'female']:
            return jsonify({'status': 'error', 'message': 'Valid sex is required (male/female)'}), 400

        # Get user email from JWT
        email = get_jwt_identity()
        print(f"JWT Identity: {email}")  # Debug log

        # Check if user exists
        user = collection.find_one({'user_id': email})
        if not user:
            print(f"User not found for user_id: {email}")  # Debug log
            return jsonify({'status': 'error', 'message': 'User not found'}), 404

        # Update user data
        result = collection.update_one(
            {'user_id': email},
            {'$set': {'name': name, 'sex': sex}}
        )
        print(f"Update result: {result.modified_count}")  # Debug log

        if result.modified_count == 0:
            return jsonify({'status': 'success', 'message': 'No changes made'}), 200

        return jsonify({'status': 'success', 'message': 'Details updated successfully'}), 200

    except Exception as e:
        current_app.logger.error(f"Error in submit_name: {e}")
        return jsonify({'status': 'error', 'message': 'Internal server error'}), 500
