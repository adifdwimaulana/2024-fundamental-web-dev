from app.task import taskBp
from flask import request, jsonify

from app.extensions import db

from app.models.task import Tasks

@taskBp.route("/", methods=["GET"], strict_slashes= False,)
def get_all_task():
    """
    Fungsi untuk mengambil semua task dari tabel tasks
    
    """
    limit = request.args.get("limit", 10)
    if type(limit) is not int:
        return jsonify({"message": "invalid parameter"}), 422
    
    tasks = db.session.execute(
        db.select(Tasks).limit(limit) #ORM
    ).scalars()

    results = []
    for task in tasks:    
        results.append(task.serialize())

    response = jsonify(
        success = True,
        data = results
    )

    return response, 200


@taskBp.route("/", methods=["POST"], strict_slashes= False,)
def create_task():
    """
    Fungsi untuk membuat task baru
    """
    data = request.get_json()
    input_title = data.get("title")
    input_description = data.get("description")
    input_user_id = data.get("user_id")

    # validasi data input
    if not input_title or not input_description or not input_user_id:
        return jsonify({"message": "Data is incomplete"}), 422
    

    newTask = Tasks(
        title=input_title, 
        description=input_description, 
        user_id=input_user_id
        )
    db.session.add(newTask)
    db.session.commit()

    response = jsonify(
        success = True,
        data = newTask.serialize(),
        message= "Data berhasil dibuat!"
    )

    return response, 200


@taskBp.route("/<int:id>", methods=["PUT"], strict_slashes= False,)
def update_task(id):
    """
    Fungsi untuk mengupdate data task
    """
    data = request.get_json()
    input_title = data.get("title")
    input_description = data.get("description")
    input_user_id = data.get("user_id")

    
    task = Tasks.query.filter_by(id=id).first()


    # validasi data input
    if not input_title or not input_description or not input_user_id:
        return jsonify({"message": "Data is incomplete"}), 422
    else:
        task.title = input_title
        task.description = input_description
        task.user_id = input_user_id

    db.session.commit()


    response = jsonify(
        success = True,
        message = "Data berhasil diubah!"
    )

    return response, 200


@taskBp.route("/<int:id>", methods=["DELETE"], strict_slashes= False,)
def delete_task(id):
    """
    Fungsi untuk menghapus data task
    """
    task = Tasks.query.filter_by(id=id).first()

    # cek apakah task dengan id ada
    if not task:
        return jsonify({"message": "Task tidak ditemukan"})
    else:
        db.session.delete(task)
        db.session.commit()


    response = jsonify(
        success = True,
        message = "Data berhasil dihapus!"
    )

    return response, 200