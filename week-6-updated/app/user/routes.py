from flask import jsonify, request
from app.user import userBp


from app.extensions import db
from app.models.user import Users
from app.models.task import Tasks

@userBp.route("/", methods=["GET"], strict_slashes=False) # mendapatkan data
def get_all_user():
    """
    Fungsi untuk mengambil semua task dari tabel tasks
    
    """
    limit = request.args.get("limit", 10)
    if type(limit) is not int:
        return jsonify({"message": "invalid parameter"}), 422
    
    users = db.session.execute(
        db.select(Users).limit(limit) #ORM
    ).scalars()

    results = []
    for user in users:    
        results.append(user.serialize())

    response = jsonify(
        success = True,
        data = results
    )

    return response, 200


@userBp.route("/", methods=["POST"], strict_slashes=False) # menambahkan data
def create_user():
    """
    Fungsi untuk membuat task baru
    """
    data = request.get_json()
    input_name = data.get("name")
    input_email = data.get("email")
    input_password = data.get("password")

    # validasi data input
    if not input_name or not input_email or not input_password:
        return jsonify({"message": "Data is incomplete"}), 422
    
    newUser = Users(name=input_name, email=input_email, password=input_password)
    
    db.session.add(newUser)
    db.session.commit()

    response = jsonify(
        success = True,
        data = newUser.serialize(),
        message= "Data berhasil dibuat!"
    )

    return response, 200
   
# route PUT user/<id>
@userBp.route("/<int:id>", methods=['PUT'], strict_slashes = False)
def edit_user(id):
    """
    Fungsi untuk mengupdate data task
    """
    data = request.get_json()
    input_name = data.get("name")
    input_email = data.get("email")
    input_password = data.get("password")

    
    user = Users.query.filter_by(id=id).first()


    # validasi data input
    if not input_name or not input_email or not input_password:
        return jsonify({"message": "Data is incomplete"}), 422
    else:
        user.name = input_name
        user.email = input_email
        user.password = input_password

    db.session.commit()

    response = jsonify(
        success = True,
        message = "Data berhasil diubah!"
    )

    return response, 200

# route DELETE users/id
@userBp.route("/<int:id>", methods=['DELETE'], strict_slashes = False)
def delete_user(id):
    """
    Fungsi untuk menghapus data task
    """
    user = Users.query.filter_by(id=id).first()

    # cek apakah task dengan id ada
    if not user:
        return jsonify({"message": "User tidak ditemukan"})
    else:
        db.session.delete(user)
        db.session.commit()

    response = jsonify(
        success = True,
        message = "Data berhasil dihapus!"
    )

    return response, 200