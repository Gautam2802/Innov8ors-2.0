# # config.py

# import os

# class Config:
#     SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")
#     MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/kyc_verification")
#     CLOUD_NAME=os.getenv("CLOUD_KEY","dngeaztbd")
#     CLOUD_API_KEY=os.getenv("CLOUD_API_KEY","756332936681698")
#     CLOUD_API_SECRET=os.getenv("CLOUD_API_SECRET",'PGSTb9754gK11krtf0fsUwF7-oY')
    
    
    
# config.py
import os
from dotenv import load_dotenv  # Import load_dotenv from dotenv

# Load environment variables from .env file
load_dotenv()  # This reads the .env file and loads the environment variables into the environment

class Config:
    # Use os.getenv() to safely access the environment variables
    SECRET_KEY = os.getenv("SECRET_KEY")  # No hardcoded fallback values, forcing the use of .env variables
    MONGO_URI = os.getenv("MONGO_URI")  # MongoDB connection string
    CLOUD_NAME = os.getenv("CLOUD_NAME")  # Cloudinary cloud name
    CLOUD_API_KEY = os.getenv("CLOUD_API_KEY")  # Cloudinary API key
    CLOUD_API_SECRET = os.getenv("CLOUD_API_SECRET")  # Cloudinary API secret