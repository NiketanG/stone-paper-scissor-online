from dotenv import load_dotenv
load_dotenv()
from flask.cli import FlaskGroup
from app import create_app, db
from app.models import Game

import os

app = create_app()
cli = FlaskGroup(create_app=create_app)

@cli.command('create_db')
def create_db():
    db.create_all()
    db.session.commit()
    print('Database Created')

if __name__ == '__main__':
    cli() 
