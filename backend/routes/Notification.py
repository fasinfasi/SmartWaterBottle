from flask import Blueprint, request, jsonify, current_app
from datetime import datetime
import jwt
import os
import requests
from dotenv import load_dotenv

load_dotenv()

notifications_bp = Blueprint('notifications_bp', __name__)

# Firebase Cloud Messaging (FCM) Server Key
FCM_SERVER_KEY = os.getenv("FIREBASE_KEY_PATH")  # Ensure this is correctly set in .env
FCM_URL = "https://fcm.googleapis.com/fcm/send"

def send_push_notification(device_token, title, body):
    """Send FCM push notification."""
    if not device_token:
        print("Error: Missing device token")
        return None

    headers = {
        "Authorization": f"key={FCM_SERVER_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "to": device_token,
        "notification": {"title": title, "body": body},
        "data": {"click_action": "FLUTTER_NOTIFICATION_CLICK", "type": "reminder"},
    }
    try:
        response = requests.post(FCM_URL, json=payload, headers=headers)
        response_json = response.json()
        print("FCM Response:", response_json)  # Debugging
        return response_json
    except requests.RequestException as e:
        print(f"Error sending FCM notification: {e}")
        return None

def decode_jwt(token):
    """Decode JWT token to extract user_id (email)."""
    try:
        secret_key = os.getenv('JWT_SECRET_KEY')
        decoded_payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        print(f"Decoded JWT Payload: {decoded_payload}")  # Debugging
        return decoded_payload.get("sub")
    except jwt.ExpiredSignatureError:
        print("JWT Token has expired")
        return None
    except jwt.InvalidTokenError:
        print("Invalid JWT Token")
        return None

@notifications_bp.route('/update_fcm_token', methods=['POST'])
def update_fcm_token():
    """Update user's FCM token and online status in the database."""
    mongo = current_app.mongo
    db = mongo.db
    users_collection = db.Client_Details  

    data = request.get_json()
    token = data.get('user_id')  # JWT token
    fcm_token = data.get('fcm_token')  # FCM token from Flutter
    is_online = data.get('is_online', False)  # Online status

    user_id = decode_jwt(token)
    if not user_id:
        return jsonify({'error': 'Invalid or expired token'}), 401

    if not fcm_token:
        return jsonify({'error': 'FCM token is missing'}), 400

    result = users_collection.update_one(
        {'user_id': user_id}, 
        {'$set': {'fcm_token': fcm_token, 'is_online': is_online}}, 
        upsert=True
    )

    if result.modified_count > 0 or result.upserted_id:
        return jsonify({'message': 'FCM token and status updated successfully'}), 200
    return jsonify({'message': 'No changes made'}), 200

@notifications_bp.route('/update_online_status', methods=['POST'])
def update_online_status():
    """Update user's online/offline status."""
    mongo = current_app.mongo
    db = mongo.db
    users_collection = db.Client_Details  

    data = request.get_json()
    token = data.get('user_id')  # JWT token
    is_online = data.get('is_online', False)  # Online status

    user_id = decode_jwt(token)
    if not user_id:
        return jsonify({'error': 'Invalid or expired token'}), 401

    result = users_collection.update_one(
        {'user_id': user_id}, 
        {'$set': {'is_online': is_online}}, 
        upsert=True
    )

    if result.modified_count > 0 or result.upserted_id:
        return jsonify({'message': 'Online status updated successfully'}), 200
    return jsonify({'message': 'No changes made'}), 200

@notifications_bp.route('/get_notifications', methods=['POST'])
def get_notifications():
    """Fetch today's hydration records and send FCM notifications dynamically if user is online."""
    try:
        mongo = current_app.mongo
        db = mongo.db
        hydration_collection = db.Hydration_Record
        users_collection = db.Client_Details  

        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON received'}), 400

        token = data.get('user_id')  
        user_id = decode_jwt(token)  
        if not user_id:
            return jsonify({'error': 'Invalid or expired token'}), 401

        # Check if user is online before sending notifications
        user_data = users_collection.find_one({'user_id': user_id}, {'_id': 0, 'fcm_token': 1, 'is_online': 1})
        if not user_data or not user_data.get('is_online', False):
            return jsonify({'error': 'User is offline, no notifications sent'}), 400

        device_token = user_data['fcm_token']
        today_date = datetime.now().strftime("%Y-%m-%d")
        print(f"Fetching hydration records for date: {today_date}")

        user_record = hydration_collection.find_one(
            {'user_id': user_id, 'current_date': today_date}, {'_id': 0, 'records': 1}
        )

        if not user_record:
            return jsonify({'error': 'No hydration records found for today'}), 404

        records = user_record.get('records', [])
        now_time = datetime.now().time()

        notifications_sent = []
        for record in records:
            print(f"Processing record: {record}")  # Debugging
            scheduled_time_str = str(record.get('scheduled_time', '')).strip()

            if not scheduled_time_str:
                print("Skipping record with missing scheduled_time")
                continue

            try:
                scheduled_time = datetime.strptime(scheduled_time_str, "%H:%M").time()
                if scheduled_time > now_time:
                    send_push_notification(device_token, "Time to Drink!", "Stay hydrated!")
                    notifications_sent.append(f"Notification sent for {scheduled_time_str}")
            except ValueError as e:
                print(f"Skipping invalid scheduled_time format: {scheduled_time_str} - Error: {e}")
                continue

        if notifications_sent:
            return jsonify({'status': 'Notifications sent', 'notifications': notifications_sent}), 200
        return jsonify({'status': 'No notifications sent'}), 200

    except Exception as e:
        print(f"Error in get_notifications: {e}")
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500
