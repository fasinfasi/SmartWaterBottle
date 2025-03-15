from flask import Blueprint, request, jsonify

# Create the blueprint
weather_bp = Blueprint('weather_bp', __name__)

# Weather-based adjustments (in liters)
def weather_adjustment(weather_condition):
    weather_adjustments = {
        "Hot": 1.0,   # Add 1 liter in hot weather
        "Cold": 0.0,  # No additional water needed in cold weather
        "Normal": 0.0 # Default, no adjustment
    }
    return weather_adjustments.get(weather_condition, 0.0)

@weather_bp.route('/adjustment', methods=['POST'])
def adjust_water_intake():
    try:
        # Get JSON data
        data = request.json
        if not data or 'weather_condition' not in data:
            return jsonify({'error': 'Invalid request, missing `weather_condition`'}), 400

        # Extract the weather condition and adjust water intake
        weather_condition = data.get('weather_condition', 'Normal')
        adjustment = weather_adjustment(weather_condition)
        
        # Return the adjustment value along with the condition
        return jsonify({
            'weather_condition': weather_condition,
            'water_adjustment': adjustment
        }), 200
    
    except Exception as e:
        # Handle any unexpected errors
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500
