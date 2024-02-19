from flask import Flask, render_template
from user import user
from task import task

app = Flask(__name__)
app.register_blueprint(user.user_bp, url_prefix="/users")
app.register_blueprint(task.task_bp, url_prefix="/tasks")
