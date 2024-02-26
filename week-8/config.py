import os

# mendapatkan path project
basedir = os.path.abspath(os.path.dirname(__file__))

# konfigurasi path database
DB_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')

class Config:
    SECRET_KEY = 'secret-key-20240219'
    SQLALCHEMY_DATABASE_URI = DB_URI
    SQLALCHEMY_TRACK_MODIFICATIONS = False
