import logging

import requests
from flask import (Blueprint, abort, current_app, jsonify, request)
from flask_login import login_required

api_url = current_app.config['API_URL']

# creates Blueprint for the dashboard
dash_api_bp = Blueprint(
    'dashboard_api',
    __name__,
    template_folder="templates",
    url_prefix="/api/dash/studies"
)


@dash_api_bp.get("")
@login_required
def retrieve_all_studies():
    response = None
    try:
        response = requests.get(f"{api_url}/study/all")
        response.raise_for_status()
        return jsonify(response.json()), 200

    except requests.RequestException as e:
        logging.error(f"Failed to create study: {e}")
        abort(response.status_code if response.status_code else 500)


@dash_api_bp.get('/<path:study_id>')
@login_required
def retrieve_study_by_id(study_id):
    response = None
    try:
        response = requests.get(f"{api_url}/study/get/{study_id}")
        response.raise_for_status()
        return jsonify(response.json()), 200

    except requests.RequestException as e:
        logging.error(f"Failed to create study: {e}")
        abort(response.status_code if response.status_code else 500)


@dash_api_bp.post("/results/<path:study_id>")
@login_required
def get_all_study_results(study_id):
    response = None
    try:
        response = requests.post(
            f"{api_url}/result/get_all/{study_id}"
        )
        response.raise_for_status()
        return jsonify(response.json()), 200
    except requests.RequestException as e:
        logging.error(f"Failed to retrieve study results: {e}")
        abort(response.status_code if response.status_code else 500)


@dash_api_bp.post("")
@login_required
def create_study():
    if not request.json:
        abort(400, description="Invalid input: No JSON data provided")

    response = None
    try:
        response = requests.post(
            f"{api_url}/study/upload", json=request.get_json())
        response.raise_for_status()
        return jsonify(response.json()), 200
    except requests.RequestException as e:
        logging.error(f"Failed to create study: {e}")
        abort(response.status_code if response.status_code else 500)


@dash_api_bp.put('/enable')
@login_required
def enable_study():
    if not request.json:
        abort(400, description="Invalid input: No JSON data provided")

    response = None
    try:
        response = requests.put(
            f"{api_url}/study/enable",
            json=request.get_json()
        )
        response.raise_for_status()
        return jsonify(response.json()), 200
    except requests.RequestException as e:
        logging.error(f"Failed to enable study: {e}")
        abort(response.status_code if response.status_code else 500)


@dash_api_bp.delete('/<path:study_id>')
@login_required
def delete_study(study_id):
    response = None
    try:
        response = requests.delete(f"{api_url}/study/delete/{study_id}")
        response.raise_for_status()
        return jsonify(response.json()), 200
    except requests.RequestException as e:
        logging.error(f"Failed to delete study: {e}")
        abort(response.status_code if response.status_code else 500)


@dash_api_bp.post('/images')
@login_required
def upload_image():
    if not request.json:
        abort(400, description="Invalid input: No JSON data provided")

    response = None
    try:
        response = requests.post(
            f"{api_url}/study/upload-base64-image",
            json=request.get_json()
        )
        response.raise_for_status()
        return jsonify(response.json()), 200
    except requests.RequestException as e:
        logging.error(f"Failed to upload study images: {e}")
        abort(response.status_code if response.status_code else 500)
