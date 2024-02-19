from flask import Flask
from app.user import userBp
from app.task import taskBp
from app.auth import authBp
from config import Config

from app.extensions import db, migrate, jwt

def create_app(config_class = Config):
    app = Flask(__name__)
    # existing code omitted

    app.config.from_object(config_class)

    # Initilizae database & migration
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    app.register_blueprint(userBp, url_prefix='/users')
    app.register_blueprint(taskBp, url_prefix='/tasks')
    app.register_blueprint(authBp, url_prefix='/auth')
    
    return app