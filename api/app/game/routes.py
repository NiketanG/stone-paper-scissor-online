from flask import render_template, Blueprint, request
from app.models import Game
from app import db, socketio
import json
import random
from flask_socketio import join_room, leave_room

game_blueprint = Blueprint('game', __name__)

@game_blueprint.route('/')
def index():
    return render_template('index.html')

@game_blueprint.route('/Game')
def game():
    return render_template('index.html')

@game_blueprint.route('/Info')
def info():
    return render_template('index.html')

@game_blueprint.route('/join/<int:game_id>')
def join_game(game_id):
    return render_template('index.html')

@game_blueprint.route('/api/create/game')
def create_game():
    game_id = random.randint(0,99999)
    game = Game.query.filter_by(game_id=game_id).first()
    while game:
        game_id = random.randint(0,99999)
    
    curr_game = Game(game_id=game_id, online='[]')
    try:
        db.session.add(curr_game)
        db.session.commit()
        print('Game Created ' + str(game_id))
    except Exception as e:
        print(e)
        db.session.rollback()
    return {'result':'success', 'game_id':game_id}

@game_blueprint.route('/api/search/game', methods=['GET', 'POST'])
def search_game():
    received_data = request.json
    game_id = received_data.get('game_id')
    curr_game = Game.query.filter_by(game_id=game_id).first()
    if curr_game:
        print('Game Found ' + str(game_id))
        return {'result': 'success', 'online':len(json.loads(curr_game.online))}
    else:
        return {'result': 'fail'}

@game_blueprint.route('/api/fetch/game', methods=['GET', 'POST'])
def fetch_game():
    received_data = request.json
    game_id = received_data.get('game_id')
    curr_game = Game.query.filter_by(game_id=game_id).first()
    if curr_game:
        print('Game found')
        return {'result' :'success', 'online': json.loads(curr_game.online), 'xMove': curr_game.xMove, 'yMove': curr_game.yMove, 'xScore': curr_game.xScore, 'yScore': curr_game.yScore}
    else:
        return {'result' :'fail', 'reason': "Game ID not found"}

@socketio.on('join', namespace='/Game')
def on_join(data):
    game_id = data.get('game_id')
    player = data.get('player')
    join_room(str(game_id))
    curr_game = Game.query.filter_by(game_id=game_id).first()
    if curr_game:
            online = json.loads(curr_game.online)
            if player not in online:
                online.append(player)
            curr_game.online = json.dumps(online)
            try:
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                print(e)
            print('Joined')
            socketio.emit('connected', {'game_id': game_id, 'online':online}, room=str(game_id), namespace='/Game')

@socketio.on('leave', namespace='/Game')
def on_leave(data):
    game_id = data.get('game_id')
    player = data.get('player')
    leave_room(str(game_id))
    curr_game = Game.query.filter_by(game_id=game_id).first()
    if curr_game:
        try:
            online = json.loads(curr_game.online)
            if player in online:
                online.remove(player)
            curr_game.online = json.dumps(online)
            try:
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                print(e)
            socketio.emit('disconnected', {'game_id': game_id, 'online':online}, room=str(game_id), namespace='/Game')
            
            #Delete rooms automatically after both players leave
            if (len(json.loads(curr_game.online)) == 0):
                try:
                    db.session.delete(curr_game)
                    db.session.commit()
                except Exception as e:
                    db.session.rollback()
                    print(e)
        except Exception as e:
            db.session.rollback()
            print(e)

@socketio.on('move', namespace='/Game')
def handle_move(move_data):
    player = move_data.get('player')
    move = move_data.get('move')
    game_id = move_data.get('game_id')
    curr_game = Game.query.filter_by(game_id=game_id).first()    
    if curr_game:
        if (player == 'X'):
            curr_game.xMove = str(move)
        elif (player == 'Y'):
            curr_game.yMove = str(move)
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(e)
        socketio.emit('moved', {'player': player, 'move': move}, room=str(game_id), namespace='/Game')

@socketio.on('restartGame', namespace='/Game')
def restartGame(data):
    game_id = data.get('game_id')
    curr_game = Game.query.filter_by(game_id=game_id).first()    
    if curr_game:
        curr_game.xMove = "Thinking"
        curr_game.yMove = "Thinking"
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(e)
        socketio.emit('restarted', namespace='/Game')


@socketio.on('winner', namespace='/Game')
def winner(data):
    game_id = data.get('game_id')
    winner = data.get('winner')
    print(winner)
    curr_game = Game.query.filter_by(game_id=game_id).first()    
    if curr_game:
        if winner == 'X':
            curr_game.xScore = curr_game.xScore + 1
        elif winner == 'Y':
            curr_game.yScore = curr_game.yScore + 1
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(e)
        