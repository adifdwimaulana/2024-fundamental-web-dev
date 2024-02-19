from flask import Blueprint
from werkzeug.exceptions import abort

authBp = Blueprint('auth', __name__)


from app.auth import routes