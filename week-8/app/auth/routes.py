from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt
from sqlalchemy.exc import IntegrityError

from app.auth import authBp
from app.models.user import Users
from app.models.blacklist_token import BlacklistToken
from app.extensions import db, jwt

@authBp.route("/register", methods=["POST"], strict_slashes=False)
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not email or not name or not password:
        return jsonify({"message": "Invalid data"}), 400
    
    try:
        newUser = Users(name=name, email=email, password=generate_password_hash(password))
        db.session.add(newUser)
        db.session.commit()
    except IntegrityError:
        return jsonify({"message": "User already exists"}), 400

    return jsonify({"message": "User created"}), 201

@authBp.route("/login", methods=["POST"], strict_slashes=False)
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Invalid data"}), 400
    
    user = Users.query.filter_by(email=email).first()

    if not user:
        return jsonify({"message": "User not found"}), 404
    elif not check_password_hash(user.password, password):
        return jsonify({"message": "Invalid password"}), 400
    
    return jsonify({
        "message": "Login success",
        "access_token": create_access_token(identity=user.id),
        "refresh_token": create_refresh_token(identity=user.id)
    })

@authBp.route("/logout", methods=["POST"], strict_slashes=False)
@jwt_required(locations=["headers"])
def logout():
    jwt = get_jwt()
    jti = jwt.get("jti")

    blacklistToken = BlacklistToken(jti=jti)
    db.session.add(blacklistToken)
    db.session.commit()

    return jsonify({"message": "Logout success"})

@jwt.token_in_blocklist_loader
def check_if_token_in_blacklist(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    token = BlacklistToken.query.filter_by(jti=jti).first()
    
    return token is not None