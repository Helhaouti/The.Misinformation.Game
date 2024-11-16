import requests
from flask import (Blueprint, current_app, flash, redirect, render_template,
                   url_for)
from flask_login import login_required, login_user, logout_user
from flask_wtf import FlaskForm
from wtforms import PasswordField, StringField
from wtforms.validators import InputRequired

from extensions.db_ext import User

api_url = current_app.config['API_URL']

# creates blueprint for loginsystem
auth_bp = Blueprint(
    'auth',
    __name__,
    template_folder="templates",
    url_prefix="/auth"
)

# Defines a form for logging in
class LoginForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired()])
    password = PasswordField('Password', validators=[InputRequired()])

# login route checks input of form and if user is in the database you will be returned to index page
@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()

    if form.validate_on_submit():
        response = requests.post(
            f"{api_url}/login/",
            json={
                "username": form.username.data,
                "password": form.password.data
            }
        )

        if response.ok:
            user = User(**response.json())
            login_user(user)
            return redirect(url_for('index.index'))
        else:
            flash('Invalid username or password', 'error')

    return render_template('auth/login.html', form=form)

# Route for logging out
@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Logout succesfull', 'info')
    return redirect(url_for('auth.login'))
