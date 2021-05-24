from flask import Flask
from app.config import Config
from flask_migrate import Migrate
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()
socketio = SocketIO()
cors = CORS()


def create_app(config_class=Config):
    app = Flask(__name__, static_folder="../../web/build/static", template_folder="../../web/build")
    app.config.from_object(Config)
    db.init_app(app)
    cors.init_app(app)
    migrate.init_app(app, db)
    socketio.init_app(app, cors_allowed_origins="*")

    from app.game.routes import game_blueprint

    app.register_blueprint(game_blueprint)

    return app
