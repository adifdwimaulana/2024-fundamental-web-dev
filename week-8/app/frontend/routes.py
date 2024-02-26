from app.frontend import frontendBp
from flask import render_template

@frontendBp.route("/", methods=["GET"], strict_slashes=False)
def index():
    return render_template("/task/index.html")

@frontendBp.route("/auth/login", methods=["GET"], strict_slashes=False)
def login():
    return render_template("/auth/login.html")

@frontendBp.route("/auth/register", methods=["GET"], strict_slashes=False)
def register():
    return render_template("/auth/registration.html")