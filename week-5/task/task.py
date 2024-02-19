from flask import Blueprint, jsonify, request
import json
import os

task_bp = Blueprint("task", __name__)

current_location = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
file_path = os.path.join(current_location, "../data/data-task.json")

def read_json(file_path):
    with open(file_path, "r") as file:
        data = json.load(file)

    return data

def write_json(file_path, data):
    with open(file_path, "w") as file:
        json.dump(data, file, indent=4)

def generate_id():
    tasks = read_json(file_path)
    id = tasks[-1]["id"] + 1

    return id

@task_bp.route("/", methods=["GET"], strict_slashes=False)
def get_all_tasks():
    # Read file data-task.json
    # Return as response
    tasks = read_json(file_path)

    return jsonify({
        "status": "success",
        "data": tasks
    })

@task_bp.route("/<int:id>", methods=["GET"], strict_slashes=False)
def get_task_by_id(id):
    # Read file data-task.json
    # Filter task by id
    # Return as response

    tasks = read_json(file_path)
    task = [task for task in tasks if task["id"] == id]

    if not task:
        return jsonify({
            "status": "failed",
            "message": "Task not found"
        }), 404

    return jsonify({
        "status": "success",
        "data": task[0]
    })

@task_bp.route("/", methods=["POST"], strict_slashes=False)
def insert_task():
    data = request.get_json()

    new_task = {
        "id": generate_id(),
        "title": data["title"],
        "description": data["description"]
    }

    current_tasks = read_json(file_path) # Membaca file data-task.json = []
    current_tasks.append(new_task) # Menambahkan element baru ke dalam list tasks

    write_json(file_path, current_tasks) # Menulis kembali file data-task.json dengan data yang baru

    return jsonify({
        "status": "success",
        "message": "Task has been added",
        "data": new_task
    })

@task_bp.route("/<int:id>", methods=["PUT"], strict_slashes=False)
def update_task(id):
    data = request.get_json()

    current_tasks = read_json(file_path) # Membaca file data-task.json = []

    # Update taks by id
    for task in current_tasks:
        if task["id"] == id:
            task["title"] = data["title"]
            task["description"] = data["description"]
            break
    
    write_json(file_path, current_tasks)

    return jsonify({
        "status": "success",
        "message": "Task has been updated"
    })

@task_bp.route("/<int:id>", methods=["DELETE"], strict_slashes=False)
def delete_task(id):
    current_tasks = read_json(file_path)

    for task in current_tasks:
        if task["id"] == id:
            current_tasks.remove(task)
            break

    write_json(file_path, current_tasks)

    return jsonify({
        "status": "success",
        "message": "Task has been deleted"
    })