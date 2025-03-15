# /route/welcome.py
from flask import Blueprint, jsonify

# Define a blueprint for the welcome routes
welcome_bp = Blueprint('welcome', __name__)

@welcome_bp.route('/')
def welcome():
    return jsonify({"message": "Welcome to AquaSync, Nice To meet you"}), 200

@welcome_bp.route('/login', methods=['POST'])
def login():
    # You can later replace this with real login logic
    return jsonify({"message": "Login endpoint working!"}), 200
