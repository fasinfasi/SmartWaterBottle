from flask import Blueprint, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity

user_profile_bp = Blueprint('user_profile', __name__)

@user_profile_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    """
    Fetch the user's profile details from MongoDB
    using JWT for authentication.
    """
    user_id = get_jwt_identity()

    try:
        # Access MongoDB through current_app
        mongo = current_app.mongo
        db = mongo.db
        collection = db.Client_Details

        # Find the user by user_id (email)
        user = collection.find_one({'user_id': user_id})

        if user:
            return jsonify({
                "name": user.get("name", ""),
                "sex": user.get("sex", ""),
                "age": user.get("age", ""),
                "weight": user.get("weight", ""),
                "activity_level": user.get("activity_level", ""),
                "health_condition": user.get("health_condition", "")
            }), 200

        # User not found
        return jsonify({"message": "User not found"}), 404

    except Exception as e:
        # Handle unexpected errors
        return jsonify({"error": f"Failed to retrieve user profile: {str(e)}"}), 500
