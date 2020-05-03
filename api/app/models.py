from app import db

class Game(db.Model):
    __tablename__ = 'stonepaperscissor'
    game_id = db.Column(db.Integer, primary_key=True)
    online = db.Column(db.String)
    xScore = db.Column(db.Integer, default=0)
    yScore = db.Column(db.Integer, default=0)
    xMove = db.Column(db.String, default="Thinking")
    yMove = db.Column(db.String, default="Thinking")
    def __repr__(self):
        return f"Game('{self.game_id}' , {self.online}, {self.xScore}, {self.yScore})"

