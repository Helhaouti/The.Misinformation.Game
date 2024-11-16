from flask import Blueprint, render_template

index_bp = Blueprint('index', __name__)

# index route renders index page
@index_bp.route('/')
def index():
    return render_template('index/index.html')
