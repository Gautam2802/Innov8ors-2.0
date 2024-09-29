# routes/user_routes.py

from flask import Blueprint, render_template

user_blueprint = Blueprint('user', __name__)

@user_blueprint.route('/')
def home():
    return "Welcome to the KYC Verification Platform"
