# app.py

from flask import Flask
from flask_cors import CORS
from config import Config
from routes.user_routes import user_blueprint
from routes.verification_routes import verification_blueprint

# Initialize Flask application
app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS to allow communication with React front-end
CORS(app)

# Register Blueprints for modular route handling
app.register_blueprint(user_blueprint)
app.register_blueprint(verification_blueprint)

# Define a simple route for testing
@app.route('/health')
def health_check():
    return "KYC Verification Platform is running!"

# Main entry point
if __name__ == '__main__':
    app.run(debug=True, port=5000)
