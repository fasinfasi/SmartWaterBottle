from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from pymongo import ReturnDocument

feedback_bp = Blueprint('feedback_bp', __name__)

@feedback_bp.route('/feedbacks', methods=['POST'])
@jwt_required()  # Ensure the user is authenticated with JWT
def submit_feedback():
    try:
        # Get the user_id from the JWT token
        user_id = get_jwt_identity()

        # Get the feedback data from the request body
        data = request.json

        # Extract answers for each feedback question
        navigationEase = data.get('navigationEase')
        reminderHelpfulness = data.get('reminderHelpfulness')
        bluetoothPerformance = data.get('bluetoothPerformance')
        waterLevelAccuracy = data.get('waterLevelAccuracy')
        hydrationUsefulness = data.get('hydrationUsefulness')
        recommendationFit = data.get('recommendationFit')
        overallExperience = data.get('overallExperience')
        encounteredBugs = data.get('encounteredBugs')
        additionalSuggestions = data.get('additionalSuggestions')

        # Error handling: Ensure all required fields are present
        if None in [navigationEase, reminderHelpfulness, bluetoothPerformance, waterLevelAccuracy,
                    hydrationUsefulness, recommendationFit, overallExperience, encounteredBugs, additionalSuggestions]:
            return jsonify({"error": "All fields are required"}), 400

        # Access MongoDB within the request context
        mongo = current_app.mongo
        dbd = mongo.db
        collection = dbd.Feedback

        # Check if the user exists in Client_Details collection
        if not mongo.db.Client_Details.find_one({'user_id': user_id}):
            return jsonify({"error": "User does not exist"}), 404

        # Create a timezone-aware timestamp for when the feedback was submitted
        today_date = datetime.now().date()

        # Let MongoDB generate the ID automatically
        feedback_id = str(collection.count_documents({}) + 1)  # Simple approach to create a feedback ID

        # Save feedback to the MongoDB database with all individual answers and timestamp
        collection.insert_one({
            '_id': feedback_id,  # Use the generated feedback ID
            'user_id': user_id,
            'navigationEase': navigationEase,
            'reminderHelpfulness': reminderHelpfulness,
            'bluetoothPerformance': bluetoothPerformance,
            'waterLevelAccuracy': waterLevelAccuracy,
            'hydrationUsefulness': hydrationUsefulness,
            'recommendationFit': recommendationFit,
            'overallExperience': overallExperience,
            'encounteredBugs': encounteredBugs,
            'additionalSuggestions': additionalSuggestions,
            'date': str(today_date)  # Only the date portion
        })

        # Return a success message with feedback ID and timestamp
        return jsonify({
            "message": "Feedback submitted successfully",
            "feedback_id": feedback_id,
             "date": str(today_date)  # Return the date
        }), 200

    except Exception as e:
        # Log the error to the console
        print(f"Error while submitting feedback: {str(e)}")
        return jsonify({"error": f"Failed to submit feedback: {str(e)}"}), 500
