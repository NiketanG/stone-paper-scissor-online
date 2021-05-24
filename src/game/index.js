import React from 'react';
import './Game.css';
import io from 'socket.io-client';
import {Redirect, Link} from 'react-router-dom';

let url = window.location.protocol + '//' + document.domain;
if (window.location.port !== "") {
	url += ':' + window.location.port;
}
url+='/Game'
let socket = io.connect(url);

class Move extends React.Component {
	render(){
		return (
			<div className="move" onClick={this.props.setMove}>
				<img src={require('./' + this.props.move + '.png')} alt={this.props.move}/>
			</div>
		)
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			xScore: 0,
			yScore: 0,
			yourMove: "Thinking",
			opponentMove: "Thinking",
			FetchedopponentMove: "Thinking",
			showRestart: false,
			winner: null
		};
	}

	componentDidMount(){
		fetch('/api/fetch/game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ game_id: this.props.game_id }),
        }).then(res => res.json())
            .then(res => {
                if (res.result === 'fail') {
                    console.log('Game doesnt exist')
                } else if (res.result === 'success') {
					let you = this.props.mode === 'create' ? 'X' : 'Y'
					if (you === 'X') {
						this.setState({yourMove: res.xMove})
						if (res.yMove !== "Thinking") {
							if (res.xMove !== "Thinking") {
								this.setState({
									opponentMove: res.yMove,
									showRestart: true
								})
								let winner = calculateWinner(res.xMove, res.yMove)
								this.setState({winner: winner})
							} else {
								this.setState({
									FetchedopponentMove: res.yMove
								})
							}
						}
					} else {
						this.setState({yourMove: res.yMove})
						if (res.xMove !== "Thinking") {
							if (res.yMove !== "Thinking") {
								this.setState({
									opponentMove: res.xMove,
									showRestart: true
								})
								let winner = calculateWinner(res.xMove, res.yMove)
								this.setState({winner: winner})
							} else {
								this.setState({
									FetchedopponentMove: res.xMove
								})
							}
						}
					}
					this.setState({xScore: res.xScore, yScore: res.yScore})
                }
            })
		socket.on('moved', (data)=>this.moved(data))
		socket.on('restarted', ()=> {
			this.setState({yourMove: "Thinking", opponentMove: "Thinking", FetchedopponentMove: "Thinking", showRestart: false, winner: null});
			// toaster.notify('Game Restarted !', {
			// 	duration: 2000
			//   })
		})
		
	}

	moved(data){
		let you = this.props.mode === 'create' ? 'X' : 'Y'
		if (this.state.yourMove !== "Thinking") {
			if (data.player !== you) {
				let winner = calculateWinner(this.state.yourMove, data.move)
				this.setState({opponentMove: data.move,
					winner: winner,
					showRestart: true})
				let winnerPlayer;
				if (winner !== 'Game Tied') {
					console.log(winner)
					if (winner === this.state.yourMove) {
						winnerPlayer = you;
					} else {
						winnerPlayer = you === 'X' ? 'Y' : 'X'
					}
					if (winnerPlayer === 'X') {
						this.setState({xScore: this.state.xScore + 1 })
					} else if (winnerPlayer === 'Y') {
						this.setState({yScore: this.state.yScore + 1 })
					}
				}
			}
		} else if (this.state.yourMove === "Thinking") {
			if (data.player !== you) {
				this.setState({opponentMove: "Unknown"})
				this.setState({FetchedopponentMove: data.move})
			}
		}
	}

	makeMove(move){
		if (this.state.yourMove === 'Thinking') {
			this.setState({yourMove: move});
			if (this.state.FetchedopponentMove !== "Thinking") {
				let winner = calculateWinner(move, this.state.FetchedopponentMove)
				let you = this.props.mode === 'create' ? 'X' : 'Y'
				this.setState({opponentMove: this.state.FetchedopponentMove,
					winner: winner,
					showRestart: true})
					let winnerPlayer;
					if (winner !== 'Game Tied') {
						if (winner === move) {
							console.log('You won')
							winnerPlayer = you;
						} else {
							console.log('You lost')
							winnerPlayer = you === 'X' ? 'Y' : 'X'
						}
						if (winnerPlayer === 'X') {
							this.setState({xScore: this.state.xScore + 1 })
						} else if (winnerPlayer === 'Y') {
							this.setState({yScore: this.state.yScore + 1 })
						}
					}
					socket.emit('winner', {'game_id': this.props.game_id, 'winner': winnerPlayer})
			}
			socket.emit('move', {"move": move, "game_id": this.props.game_id, "player" : (this.props.mode === 'create' ? "X" : "Y")});
		}	
	}

	restartGame(){
		socket.emit('restartGame', {"game_id": this.props.game_id});	
	}

	render() {
		let winner = this.state.winner
		let you = this.props.mode === 'create' ? 'X' : 'Y'
		let winnerPlayer;
		if (winner === null || winner === 'Game Tied') {
			winnerPlayer = null
		} else if (winner !== 'Game Tied') {
			if (winner === this.state.yourMove) {
				winnerPlayer = you;
			} else {
				winnerPlayer = you === 'X' ? 'Y' : 'X'
			}
		}
		
		return (
			<div className="game-board">
				<h1>Score</h1>
				<p>You : {
						this.props.mode === 'create' ? this.state.xScore : this.state.yScore
					} | Opponent : {
						this.props.mode === 'create' ? this.state.yScore : this.state.xScore
					}</p>
				<div className="moves">
				
						<div className={ winnerPlayer !== null ? (winnerPlayer === you ? "yourMove winner" : "yourMove") : "yourMove" }>
							<Move move={this.state.yourMove}/>
						</div>
					<h2>vs</h2>
					
					
					<div className={ winnerPlayer !== null ? (winnerPlayer !== you ? "opponentMove winner" : "opponentMove") : "opponentMove" }>
						<Move move={this.state.opponentMove}/>
					</div>
				</div>
				{
					this.state.winner !== null ? 
					(
						this.state.winner === 'Game Tied' ? <p>Game Tied</p> :
						this.state.yourMove === this.state.winner ? <p><b>You won</b></p> : <p><b>You lost</b></p>
					)
					: null
				}
				<div className="makeMove" >
					<div onClick={() => this.makeMove('Stone')}>
						<Move move="Stone" />	
					</div>
					<div onClick={() => this.makeMove('Paper')}>
						<Move move="Paper" />	
					</div>
					<div onClick={() => this.makeMove('Scissor')}>
						<Move move="Scissor" />	
					</div>
				</div>
				<br/>
				{this.state.showRestart === true ? 
				<button onClick={() => this.restartGame()}>Restart</button> : null}
			</div>
		);
	}
}

function calculateWinner(xMove, yMove) {
	var winner = [
		[["Stone", "Paper"], "Paper"],
		[["Paper", "Scissor"], "Scissor"],
		[["Stone", "Scissor"], "Stone"]
	]
	if (xMove === yMove) {
		return 'Game Tied'
	}
	else {
		for (let i = 0; i < winner.length; i++) {
			if (winner[i][0].includes(xMove) && winner[i][0].includes(yMove)) {
				return winner[i][1]
			}
		}
		
	}
}
class App extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			online: 0
		}
	}

	componentDidMount(){
		if (this.props.location.state !== undefined) {
			socket.emit('join', {"game_id": this.props.location.state.gameID, "player" : (this.props.location.state.mode === 'create' ? "X" : "Y")});
		}
		socket.on('connected', (data)=>this.connected(data))
		socket.on('disconnected', (data)=>this.connected(data))
	}

	connected(data){
		this.setState({online: data.online.length});
	}

	componentWillUnmount(){
		if (this.props.location.state !== undefined) {
			socket.emit('leave', {"game_id": this.props.location.state.gameID, "player" : (this.props.location.state.mode === 'create' ? "X" : "Y")});
		}
	}

	render(){
		return (
			(this.props.location.state === undefined ? <Redirect to='/' /> : 
			<div className="game-window">
				<Link to="/" className="goHome">Go Home</Link>
				<p className="online">Joined : {this.state.online} </p>
				<div className="parent">
					<div className="game">
						<Game 
						game_id={this.props.location.state.gameID} mode={this.props.location.state.mode}/>
					</div>
				</div>
				<p className="gameID_Info">Game : {this.props.location.state.gameID}
				</p>
			</div>
			)
		);
	}
}

export default App;