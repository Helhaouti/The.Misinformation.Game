from flask_login import UserMixin


class User(UserMixin):
    def __init__(
        self,
        id,
        username,
        email,
        password_hash,
        first_name=None,
        last_name=None,
        active=True,
        **kwargs
    ):
        self.id = id
        self.username = username
        self.email = email
        self.first_name = first_name
        self.last_name = last_name
        self.password_hash = password_hash
        self._active = active

    def __repr__(self):
        return f'<User {self.username}>'

    @property
    def is_active(self):
        return self._active
