from flask import Flask

from extensions.db_ext import User


def register_shell_context(app: Flask):
    def create_shell_context():
        return {'User': User}

    app.shell_context_processor(create_shell_context)
