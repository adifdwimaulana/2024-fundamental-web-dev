from flask import Blueprint
from werkzeug.exceptions import abort

taskBp = Blueprint('task', __name__)


from app.task import routes