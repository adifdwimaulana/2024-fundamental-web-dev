from flask import Blueprint, jsonify, request
import json
import os

user_bp = Blueprint("user", __name__)

# API method: GET, POST, PUT, DELETE, PATCH
# GET: get data
# POST: create data / insert
# PUT: update data
# PATCH: update data
# DELETE: delete data

current_location = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
file_path = os.path.join(current_location, "../data/data-user.json")

def read_json(file_path):
    with open(file_path, "r") as file:
        data = json.load(file)

    return data

def write_json(file_path, data):
    with open(file_path, "w") as file:
        json.dump(data, file, indent=4)

@user_bp.route("/", methods=["GET"], strict_slashes=False)
def get_users():
    users = read_json(file_path)

    return jsonify({
        "status": "success",
        "data": users
    })

@user_bp.route("/register", methods=["POST"], strict_slashes=False)
def register_user():
    data = request.get_json()

    new_user = {
        "email": data["email"],
        "password": data["password"]
    }

    users = read_json(file_path)
    users.append(new_user)

    write_json(file_path, users)

    return jsonify({
        "status": "success",
        "message": "User registered"
    })
