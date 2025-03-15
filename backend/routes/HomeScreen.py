from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required

home_screen_bp = Blueprint('home_screen', __name__)

# Endpoint for water consumption data
@home_screen_bp.route('/water-data', methods=['GET'])
@jwt_required()
def get_water_data():
    # Fetch data from the MongoDB Temporary_Storage collection
    mongo = current_app.mongo
    db = mongo.db
    collection = db.Temporary_Storage
    water_entry = collection.find_one({"type": "water_status"}, {"_id": 0})  # Fetch document with type water_status

    # Default values in case of missing data
    water_volume = float(water_entry.get("volume", "0"))  # Convert volume to float
    water_percentage = water_entry.get("percentage", "0%").replace("%", "")  # Remove percentage symbol and convert to float
    water_percentage = float(water_percentage)
    water_stable = water_entry.get("stable", False)  # Read the stability flag
    water_status = water_entry.get("status", "OK")

    # Handle specific conditions
    if not water_stable or water_status in ["Bottle Empty", "Sensor Error", "Overload", "Cap Open"]:
        water_volume = 0
        water_percentage = 0

    # Example response
    data = {
        "current_consumption": water_volume,
        "target_consumption": 3600,  # Example target consumption
        "water_purity": "Good",  # Example placeholder data
        "water_level_percentage": water_percentage,
        "battery_level": 58  # Example placeholder for battery level
    }
    return jsonify(data), 200


@home_screen_bp.route('/update-water', methods=['POST'])
@jwt_required()
def update_water_data():
    data = request.json
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    # Extract volume and percentage
    water_volume = data.get('volume')
    water_percentage = data.get('percentage')

    # Update MongoDB Temporary_Storage collection
    mongo = current_app.mongo
    db = mongo.db
    collection = db.Temporary_Storage

    update_data = {}
    if water_volume is not None:
        update_data['volume'] = str(water_volume)  # Store volume as string
    if water_percentage is not None:
        update_data['percentage'] = f"{water_percentage}"  # Add percentage symbol

    collection.update_one({"type": "water_status"}, {"$set": update_data}, upsert=True)

    return jsonify({'message': 'Water data updated successfully'}), 200