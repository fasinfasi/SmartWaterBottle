import os

class Config:
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/SWB')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', '2f530b65e61462223eab881ce0c3a9e3f087ffc0358c60bf')  # Change this in production
