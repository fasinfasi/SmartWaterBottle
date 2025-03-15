# routes/google_auth.py
from flask import Blueprint, request, jsonify, current_app
from google.oauth2 import id_token
from google.auth.transport import requests

google_auth_bp = Blueprint('google_auth', __name__)

@google_auth_bp.route('/google-auth', methods=['POST'])
def google_auth():
    data = request.json
    id_token_str = data.get('id_token')

    if not id_token_str:
        return jsonify({'error': 'ID token is required'}), 400

    try:
        # Verify the token
        id_info = id_token.verify_oauth2_token(id_token_str, requests.Request(), 'YOUR_GOOGLE_CLIENT_ID')

        user_email = id_info.get('email')
        
        # Use current_app to access mongo inside the app context
        if not current_app.extensions['pymongo'].db.users.find_one({'email': user_email}):
            # Register the user if not already registered
            current_app.extensions['pymongo'].db.users.insert_one({
                'name': id_info.get('name'),
                'email': user_email,
                'password': 'google_oauth',  # Or handle Google OAuth specifics
            })

        return jsonify({'message': 'User authenticated successfully', 'user': id_info}), 200

    except ValueError:
        return jsonify({'error': 'Invalid token'}), 400
