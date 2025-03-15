from flask import Flask
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from authlib.integrations.flask_client import OAuth
from apscheduler.schedulers.background import BackgroundScheduler
import os
import urllib.parse
import atexit
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Import Blueprints
from routes.welcome import welcome_bp
from routes.login import login_bp
from routes.signup import signup_bp
from routes.auth import auth_bp
from routes.google_auth import google_auth_bp
from routes.HomeScreen import home_screen_bp
from routes.InputName import input_name_bp
from routes.InputAge import input_age_bp
from routes.InputWeight import input_weight_bp
from routes.Status import status_bp
from routes.settings import settings_bp
from routes.Feedback import feedback_bp
from routes.Weather_adjustment import weather_bp
from routes.Water_Intake import water_intake_bp
from routes.EditProfile import edit_profile_bp
from routes.Data_Analysis import analysis_bp
from routes.Hydration_Calculation import hydration_Calculation_bp
from routes.Hydration_graph import hydration_graph_bp
from routes.InputAge import update_ages

# Initialize Flask app
def create_app():
    app = Flask(__name__)
    CORS(app)

    # MongoDB configuration - Using only Atlas
    encoded_user = urllib.parse.quote_plus(os.getenv('MONGO_USER'))
    encoded_password = urllib.parse.quote_plus(os.getenv('MONGO_PASSWORD'))
    app.config["MONGO_URI"] = f"mongodb+srv://{encoded_user}:{encoded_password}@cluster0.jwb1w.mongodb.net/SWB"

    # Initialize PyMongo for Atlas connection
    mongo = PyMongo(app)  # Initialize PyMongo using the app's config directly
    app.mongo = mongo  # Attach the mongo instance to the app

    # JWT configuration
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

    # Initialize OAuth
    oauth = OAuth(app)

    # Register blueprints
    app.register_blueprint(welcome_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(signup_bp)
    app.register_blueprint(auth_bp, url_prefix='/auth/signin')
    app.register_blueprint(google_auth_bp, url_prefix='/google-auth')
    app.register_blueprint(home_screen_bp, url_prefix='/water-data')
    app.register_blueprint(input_name_bp)
    app.register_blueprint(input_age_bp, url_prefix='/api')
    app.register_blueprint(input_weight_bp, url_prefix='/api')
    app.register_blueprint(status_bp, url_prefix='/status')
    app.register_blueprint(settings_bp, url_prefix='/settings/sleep-time')
    app.register_blueprint(feedback_bp, url_prefix='/api/submit-feedback')
    app.register_blueprint(weather_bp, url_prefix='/weather_bp')
    app.register_blueprint(water_intake_bp, url_prefix='/calculate-water-intake')
    app.register_blueprint(edit_profile_bp, url_prefix='/edit_profile')
    app.register_blueprint(analysis_bp, url_prefix='/analysis')
    app.register_blueprint(hydration_Calculation_bp, url_prefix='/hydration_calculation')
    app.register_blueprint(hydration_graph_bp, url_prefix='/hydration_graph')

    # Scheduler setup for periodic updates
    scheduler = BackgroundScheduler(timezone='UTC')
    scheduler.add_job(func=lambda: update_ages_task(app), trigger='interval', days=1)  # Pass the app instance
    scheduler.start()
    atexit.register(lambda: scheduler.shutdown())

    return app

# Task to update ages using the app context
def update_ages_task(app):
    with app.app_context():
        update_ages()

# Run the app
if __name__ == "__main__":
    app = create_app()
    app.run(
        debug=True, 
        host='0.0.0.0', 
        port=8081,
    )
