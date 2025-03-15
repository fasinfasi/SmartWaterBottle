from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity

# Shared storage for water volume and percentage
water_data = {}
previous_water_data = {'volume': None, 'percentage': None}  # To track previous values

# Create a blueprint for water status
water_status_bp = Blueprint('water_status', __name__)

@water_status_bp.route('/update_water_status', methods=['GET', 'POST'])
@jwt_required()  # Ensure the user is authenticated with JWT
def update_water_status():
    # Get MongoDB client and collection
    mongo = current_app.mongo
    db = mongo.db
    collection = db.Temporary_Storage

    # Get the authenticated user's email (user_id) from the JWT
    email = get_jwt_identity()
    if not email:
        return jsonify({'error': 'Invalid token or user identity missing'}), 401

    if request.method == 'POST':
        # Handle POST request - expecting data in JSON format
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Extract water volume, percentage, and stable from the request
        water_volume = data.get('volume')
        water_percentage = data.get('percentage')
        stable = data.get('stable', False)  # Default stable to False if not provided

        print(f"POST Request Received for user_id={email}: volume={water_volume}, percentage={water_percentage}, stable={stable}")

        # Process water_volume: remove "Volume:" prefix if present and store as a float
        if water_volume is not None:
            if isinstance(water_volume, str) and water_volume.startswith("Volume:"):
                water_volume = (water_volume.split(":")[1].strip().split()[0])
            else:
                water_volume = (water_volume)  # Ensure it's a float
            water_data['volume'] = water_volume

        # Process water_percentage
        if water_percentage is not None:
            water_data['percentage'] = water_percentage

        # Check if the water data has changed compared to the previous data
        is_stable = True
        if (water_data.get('volume') != previous_water_data['volume'] or 
            water_data.get('percentage') != previous_water_data['percentage']):
            is_stable = False  # Values have changed, so the stable flag should be False

        # Update stable status
        water_data['stable'] = is_stable

        # Update MongoDB with new values, including user_id (email)
        collection.update_one(
            {'user_id': email, 'type': 'water_status'},
            {
                '$set': {
                    'volume': water_data.get('volume'),
                    'percentage': water_data.get('percentage'),
                    'stable': water_data.get('stable')
                }
            },
            upsert=True
        )

        # Store the current data as previous data for the next comparison
        previous_water_data['volume'] = water_data.get('volume')
        previous_water_data['percentage'] = water_data.get('percentage')

        # Prepare response
        response = {
            'message': 'Water status updated successfully',
            'user_id': email,
            'water_volume': water_data.get('volume'),
            'water_percentage': water_data.get('percentage'),
            'stable': water_data.get('stable')
        }
        print(f"Updated Water Status for user_id={email}: {response}")
        return jsonify(response), 200

    elif request.method == 'GET':
        # Handle GET request - retrieve data from MongoDB
        water_status = collection.find_one({'user_id': email, 'type': 'water_status'}, {'_id': 0})

        if water_status:
            # Update in-memory storage and return data
            water_data.update(water_status)
            print(f"GET Request - Water Status Retrieved for user_id={email}: {water_status}")
            return jsonify({'message': 'Water status retrieved successfully', **water_status}), 200

        # If no data in MongoDB, fall back to in-memory data
        if water_data:
            print(f"GET Request - Water Status Retrieved from In-Memory for user_id={email}: {water_data}")
            return jsonify({
                'message': 'Water status retrieved from in-memory storage',
                'user_id': email,
                'water_volume': water_data.get('volume'),
                'water_percentage': water_data.get('percentage'),
                'stable': water_data.get('stable', False)
            }), 200

        # If no data is found
        print(f"GET Request - No Water Status Found for user_id={email}")
        return jsonify({'message': 'No water status found'}), 404
