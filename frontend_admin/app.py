

def create_app():
    from flask import Flask
    app = Flask(__name__)
    from flask_cors import CORS
    CORS(app)

    from config.config import ConfigDebug, ConfigProd
    app.config.from_object(ConfigDebug if app.debug else ConfigProd)

    with app.app_context():
        from extensions.auth_ext import login_manager
        login_manager.init_app(app)

        from blueprints.auth_view import auth_bp
        app.register_blueprint(auth_bp)
        from blueprints.index_view import index_bp
        app.register_blueprint(index_bp)
        from blueprints.dashboard.dashboard_view import dash_view_bp
        app.register_blueprint(dash_view_bp)
        from blueprints.dashboard.dashboard_api import dash_api_bp
        app.register_blueprint(dash_api_bp)

        from config.errors import register_errorhandlers
        register_errorhandlers(app)
        from config.shell import register_shell_context
        register_shell_context(app)

    return app
