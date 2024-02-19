from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.task import taskBp
from app.extensions import db
from app.models.task import Tasks

@taskBp.route("/", methods=["GET"], strict_slashes= False)
@jwt_required(locations=["headers"])
def get_all_task():
    """
    Fungsi untuk mengambil semua task dari tabel tasks
    
    """
    limit = request.args.get("limit", 10)
    if type(limit) is not int:
        return jsonify({"message": "invalid parameter"}), 422
    
    user_id = get_jwt_identity()
    tasks = Tasks.query.filter_by(user_id=user_id).limit(limit).all()

    results = []
    for task in tasks:    
        results.append(task.serialize())

    response = jsonify(
        success = True,
        data = results
    )

    return response, 200


@taskBp.route("/", methods=["POST"], strict_slashes= False)
@jwt_required(locations=["headers"])
def create_task():
    """
    Fungsi untuk membuat task baru
    """
    data = request.get_json()
    input_title = data.get("title")
    input_description = data.get("description")

    # validasi data input
    if not input_title or not input_description:
        return jsonify({"message": "Data is incomplete"}), 422
    
    user_id = get_jwt_identity()

    newTask = Tasks(
        title=input_title, 
        description=input_description, 
        user_id=user_id
    )
    db.session.add(newTask)
    db.session.commit()

    response = jsonify(
        success = True,
        data = newTask.serialize(),
        message= "Data berhasil dibuat!"
    )

    return response, 200


@taskBp.route("/<int:id>", methods=["PUT"], strict_slashes= False)
@jwt_required(locations=["headers"])
def update_task(id):
    """
    Fungsi untuk mengupdate data task
    """
    data = request.get_json()
    input_title = data.get("title")
    input_description = data.get("description")

    user_id = get_jwt_identity()
    task = Tasks.query.filter_by(id=id).first()

    if not task:
        return jsonify({"message": "Task tidak ditemukan"}), 404
    
    if task.user_id != user_id:
        return jsonify({"message": "Anda tidak memiliki akses"}), 403

    # validasi data input
    if not input_title or not input_description:
        return jsonify({"message": "Data is incomplete"}), 422
    else:
        task.title = input_title
        task.description = input_description
        task.user_id = user_id

    db.session.commit()

    response = jsonify(
        success = True,
        message = "Data berhasil diubah!"
    )

    return response, 200


@taskBp.route("/<int:id>", methods=["DELETE"], strict_slashes= False)
@jwt_required(locations=["headers"])
def delete_task(id):
    """
    Fungsi untuk menghapus data task
    """
    user_id = get_jwt_identity()
    task = Tasks.query.filter_by(id=id).first()

    # cek apakah task dengan id ada
    if not task:
        return jsonify({"message": "Task tidak ditemukan"})
    
    if task.user_id != user_id:
        return jsonify({"message": "Anda tidak memiliki akses"}), 403

    db.session.delete(task)
    db.session.commit()

    response = jsonify(
        success = True,
        message = "Data berhasil dihapus!"
    )

    return response, 200