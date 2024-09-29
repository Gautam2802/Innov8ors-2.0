# config.py

import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/kyc_verification")
    CLOUD_NAME=os.getenv("CLOUD_KEY","dngeaztbd")
    CLOUD_API_KEY=os.getenv("CLOUD_API_KEY","756332936681698")
    CLOUD_API_SECRET=os.getenv("CLOUD_API_SECRET",'PGSTb9754gK11krtf0fsUwF7-oY')