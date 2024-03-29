from app.extensions import db
import datetime


# table database user
class Users(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(64), nullable = False)
    email = db.Column(db.String(128), unique = True, nullable = False)
    password = db.Column(db.String(1024), nullable = False)
    created_at = db.Column(db.DateTime, default = datetime.datetime.now())
    # cara 1 membuat ralasi
    tasks = db.relationship('Tasks', back_populates='user')


    # fungsi serialize untuk mengembalikan data dictionary
    def serialize(self): 
        return {
            "id": self.id,
            "name": self.name,
            "email":self.email,
            # "password": self.password,
            "task": [task.serialize() for task in self.tasks]
        }
