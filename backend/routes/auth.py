from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from pymongo import MongoClient

# Create Blueprint for authentication
auth_bp = Blueprint('auth_bp', __name__)

# Connect to MongoDB (adjust the URI as per your MongoDB setup)
client = MongoClient("mongodb://localhost:27017/")
db = client['myDatabase']

# Sign-in route
@auth_bp.route('/auth/signin', methods=['POST'])
def sign_in():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Find the user in the database by email
    user = db.users.find_one({'email': email})

    if not user or not check_password_hash(user['password'], password):
        return jsonify({"error": "Invalid credentials"}), 401

    # Generate JWT token for the user
    access_token = create_access_token(identity=user['_id'])

    return jsonify(access_token=access_token), 200


# Sign-out route (dummy, as JWT is stateless)
@auth_bp.route('/auth/signout', methods=['POST'])
@jwt_required()  # This ensures that only authenticated users can access this route
def sign_out():
    # Since JWT is stateless, we do not invalidate the token on the backend.
    # Sign-out can simply be handled on the client-side by removing the token.
    
    return jsonify({"message": "Successfully signed out"}), 200


# Example of a protected route
@auth_bp.route('/auth/protected', methods=['GET'])
@jwt_required()  # Protect this route with JWT authentication
def protected():
    # Access the identity of the current user (the user who owns the JWT)
    current_user_id = get_jwt_identity()
    
    return jsonify({"message": f"Hello, user with ID {current_user_id}!"}), 200
