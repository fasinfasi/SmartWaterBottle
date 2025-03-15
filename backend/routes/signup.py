from flask import Blueprint, request, jsonify, current_app
import bcrypt
import jwt
import os
from datetime import datetime, timedelta, timezone
from pymongo import ASCENDING
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

signup_bp = Blueprint('signup', __name__)

# Secret keys for encoding JWT and Refresh Token
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
REFRESH_TOKEN_SECRET_KEY = os.getenv('REFRESH_TOKEN_SECRET_KEY')
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')

# Ensure secrets are set
if not JWT_SECRET_KEY or not REFRESH_TOKEN_SECRET_KEY:
    raise ValueError("Secret keys for JWT and Refresh Tokens are missing. Check your environment variables.")
if not GOOGLE_CLIENT_ID:
    raise ValueError("Google Client ID is missing. Check your environment variables.")

# Route: /register (POST) - User Registration
@signup_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Missing fields'}), 400

    mongo = current_app.mongo  # Access Mongo instance from current_app

    # Use the correct database and collection
    db = mongo.db  # Default database
    collection = db.Client_Details  # Client_Details collection

    # Check if user exists in the collection
    if collection.find_one({'email': email}):
        return jsonify({'error': 'Email already exists'}), 400

    # Hash the password using bcrypt
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Insert the new user into the Client_Details collection
    collection.insert_one({
        'user_id': email,  # Use email as user_id
        'email': email,
        'password': hashed_password,
    })

    # Create the JWT access and refresh tokens, including 'sub' claim
    access_token = jwt.encode({
        'sub': email,  # Add 'sub' claim
        'user_id': email,
        'exp': datetime.now(timezone.utc) + timedelta(hours=1)  # Access token expiration (1 hour)
    }, JWT_SECRET_KEY, algorithm='HS256')

    refresh_token = jwt.encode({
        'sub': email,  # Add 'sub' claim
        'user_id': email,
        'exp': datetime.now(timezone.utc) + timedelta(days=7)  # Refresh token expiration (7 days)
    }, REFRESH_TOKEN_SECRET_KEY, algorithm='HS256')

    # Return the tokens after successful registration
    return jsonify({
        'message': 'User registered successfully',
        'access_token': access_token,
        'refresh_token': refresh_token
    }), 201


# Route: /auth/google (POST) - Google OAuth Authentication
@signup_bp.route('/auth/google', methods=['POST'])
def google_login():
    token = request.json.get('id_token')
    if not token:
        return jsonify({'error': 'Missing ID token'}), 400

    try:
        # Verify the token with Google
        id_info = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)
        email = id_info['email']

        mongo = current_app.mongo

        # Access the correct database and collection
        db = mongo.db
        collection = db.Client_Details

        # Check if the user exists
        user = collection.find_one({'email': email})
        if not user:
            # Create a new user if they don't exist
            collection.insert_one({
                'user_id': email,
                'email': email,
                'password': None,  # No password for Google OAuth users
            })

        # Generate JWT (Access Token) and Refresh Token for the user, including 'sub' claim
        access_token = jwt.encode({
            'sub': email,  # Add 'sub' claim
            'user_id': email,
            'exp': datetime.now(timezone.utc) + timedelta(hours=1)  # Access token expiration (1 hour)
        }, JWT_SECRET_KEY, algorithm='HS256')

        refresh_token = jwt.encode({
            'sub': email,  # Add 'sub' claim
            'user_id': email,
            'exp': datetime.now(timezone.utc) + timedelta(days=7)  # Refresh token expiration (7 days)
        }, REFRESH_TOKEN_SECRET_KEY, algorithm='HS256')

        return jsonify({
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 200

    except ValueError:
        return jsonify({'error': 'Invalid token'}), 401


# Ensure 'user_id' is unique and indexed in the database
def create_indexes():
    mongo = current_app.mongo
    db = mongo.db
    collection = db.Client_Details
    collection.create_index([('user_id', ASCENDING)], unique=True)
