from flask import Flask, render_template


def register_errorhandlers(app: Flask):
    def handle_unauthorized_acces(error):
        return render_template('error/401.html'), 401

    def handle_not_found(error):
        return render_template('error/404.html'), 404

    def handle_internal_error(error):
        return render_template('error/500.html'), 500

    app.register_error_handler(401, handle_unauthorized_acces)
    app.register_error_handler(404, handle_not_found)
    app.register_error_handler(500, handle_internal_error)
