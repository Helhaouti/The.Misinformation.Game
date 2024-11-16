import logging

import requests
from flask import (Blueprint, redirect, current_app, url_for, render_template,
                   request)
from flask_login import login_required

api_url = current_app.config['API_URL']

# creates Blueprint for the dashboard
dash_view_bp = Blueprint(
    'dashboard_view',
    __name__,
    template_folder="templates",
    url_prefix="/dash"
)


@dash_view_bp.get('/studies/')
@login_required
def get_studies():
    return render_template('dash/studies.html')


@dash_view_bp.get('/studies/<path:study_id>')
@login_required
def get_study_by_id(study_id):
    if not study_id.strip():
        redirect(url_for('dashboard_view.get_studies'))

    return render_template('dash/study_details.html')
