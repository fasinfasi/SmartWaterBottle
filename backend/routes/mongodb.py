# mongodb.py

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os

# Fetch MongoDB credentials from environment variables
MONGO_URI = os.getenv("MONGO_URI")

def get_mongo_client():
    # Create a new client and connect to the server
    client = MongoClient(MONGO_URI, server_api=ServerApi('1'))
    # Send a ping to confirm a successful connection
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
        return client
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        return None
