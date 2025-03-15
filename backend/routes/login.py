from flask import Blueprint, request, jsonify, current_app
import bcrypt
import jwt
import os
from datetime import datetime, timedelta

login_bp = Blueprint('login', __name__)

# Secret keys for encoding JWT
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
REFRESH_TOKEN_SECRET_KEY = os.getenv('REFRESH_TOKEN_SECRET_KEY')

# Ensure the secret keys are set
if not JWT_SECRET_KEY or not REFRESH_TOKEN_SECRET_KEY:
    raise ValueError("JWT_SECRET_KEY or REFRESH_TOKEN_SECRET_KEY is missing. Check your environment variables.")

# Route: /login (POST) - User Login
@login_bp.route('/log', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Debugging print: Display the received email
    print(f"Received email: {email}")

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    mongo = current_app.mongo  # Access MongoDB instance from current_app

    # Access the correct database and collection
    db = mongo.db
    collection = db.Client_Details

    # Check if user exists in the collection
    user = collection.find_one({'email': email})
    if not user:
        print(f"User with email {email} not found in the database.")
        return jsonify({'error': 'Email not found'}), 404  # Return 404 if email doesn't exist

    # Retrieve stored hashed password from the database
    stored_password = user.get('password')
    if not stored_password:
        print(f"Password field is missing for user with email {email}.")  # More detailed log
        return jsonify({'error': 'Invalid email or password'}), 401  # Invalid email error

    # Verify password using bcrypt
    if not bcrypt.checkpw(password.encode('utf-8'), stored_password):
        print(f"Password for email {email} is incorrect.")  # More detailed log
        return jsonify({'error': 'Invalid password'}), 401  # Invalid password error

    # Generate JWT access token
    access_token = jwt.encode({
        'sub': user['user_id'],  # Adding the sub claim
        'exp': datetime.utcnow() + timedelta(minutes=15)  # Access token expiration (15 minutes)
    }, JWT_SECRET_KEY, algorithm='HS256')

    # Generate JWT refresh token
    refresh_token = jwt.encode({
        'sub': user['user_id'],  # Adding the sub claim
        'exp': datetime.utcnow() + timedelta(days=7)  # Refresh token expiration (7 days)
    }, REFRESH_TOKEN_SECRET_KEY, algorithm='HS256')

    # Return success response with JWT access token and refresh token
    print(f"Login successful for {email}. JWT generated.")  # More detailed log
    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'refresh_token': refresh_token
    }), 200
