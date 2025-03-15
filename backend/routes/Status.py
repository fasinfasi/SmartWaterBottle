from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity

status_bp = Blueprint('submit_status', __name__)

def activity_adjustment(activity_level):
    adjustments = {
        "Low": 0.0,
        "Moderate": 0.5,
        "High": 1.0
    }
    return adjustments.get(activity_level, 0.0)

def health_adjustment(health_condition):
    adjustments = {
        "Kidney Stones": 0.5,
        "Diabetes": 0.5,
        "Pregnancy": 0.3,
        "Breastfeeding": 0.7,
        "Liver Disease": -0.5,
        "Dialysis": -0.7,
        "None": 0.0
    }
    return adjustments.get(health_condition, 0.0)

def calculate_adjustment(activity_level, health_condition):
    return (activity_adjustment(activity_level) + health_adjustment(health_condition))

@status_bp.route('/status', methods=['POST'])
@jwt_required()
def submit_status():
    email = get_jwt_identity()
    data = request.json
    activity_level = data.get('activityLevel')
    health_condition = data.get('healthCondition')
    
    if not activity_level or not health_condition:
        return jsonify({'error': 'Activity Level and Health Condition are required'}), 400

    status_data = {
        'activity_level': activity_level,
        'health_condition': health_condition
    }
    
    try:
        mongo = current_app.mongo
        db = mongo.db
        collection = db.Client_Details
        
        result = collection.update_one(
            {'email': email},
            {'$set': status_data}
        )
        if result.matched_count == 0:
            return jsonify({'error': 'User not found'}), 404
        
        # Optionally apply adjustments here if needed
        adjustment = calculate_adjustment(activity_level, health_condition)
        return jsonify({'message': 'Status updated successfully', 'adjustment': adjustment}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@status_bp.route('/status2', methods=['POST'])
@jwt_required()
def status():
    email = get_jwt_identity()
    
    try:
        mongo = current_app.mongo
        db = mongo.db
        collection = db.Client_Details
        
        user = collection.find_one({'email': email}, {'_id': 0, 'activity_level': 1, 'health_condition': 1})
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'activity_level': user.get('activity_level'),
            'health_condition': user.get('health_condition')
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
