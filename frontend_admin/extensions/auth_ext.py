import requests
from flask import current_app
from flask_login import LoginManager

from .db_ext import User

login_manager = LoginManager()

# define a function to load a user by id
@login_manager.user_loader
def load_user(user_id):
    response = requests.get(f"{current_app.config['API_URL']}/login/{user_id}")

    if response.ok:
        return User(**response.json())
    else:
        return None
