from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity

input_weight_bp = Blueprint('input_weight_bp', __name__)

def weight_adjustment(weight):
    return weight * 0.03  # Adjust for weight (liters)

@input_weight_bp.route('/submit_weight', methods=['POST'])
@jwt_required()
def submit_weight():
    try:
        # Parse JSON data from the request
        data = request.json
        weight = data.get('weight')

        if weight is None:
            return jsonify({'error': 'Weight is required'}), 400

        # Get the email from the JWT token (assuming email is stored as identity)
        email = get_jwt_identity()

        # Access the MongoDB instance using current_app
        mongo = current_app.mongo
        db = mongo.db
        collection = db.Client_Details

        # Find the user by email
        existing_user = collection.find_one({'email': email})

        if existing_user:
            # If the user exists, update the weight field only
            collection.update_one({'email': email}, {'$set': {'weight': weight}})
            
            # Optionally include weight adjustment in the response
            adjustment = weight_adjustment(weight)
            return jsonify({
                'message': 'Weight updated successfully',
                'weight': weight,
                'adjustment': adjustment
            }), 200
        else:
            return jsonify({'error': 'User not found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500
