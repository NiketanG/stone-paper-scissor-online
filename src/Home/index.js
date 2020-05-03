import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './index.css';
class Home extends Component{
    constructor(props) {
		super(props);
		this.state = {
            gameID: null,
            joinGameInput: false,
            gameIDtoJoin: null,
            gameExists: true,
            submitted: false,
            bothJoined: false
        };
        this.changeValue = this.changeValue.bind(this);
        this.searchGame = this.searchGame.bind(this);
        this.startGame = this.startGame.bind(this);
	}
    createGame(){
        console.log('Creating Game');
        this.setState({joinGameInput: false})
        fetch('/api/create/game')
			.then((response) => response.json())
			.then((data) => {
				if (data.result === 'success') {
                    this.setState({gameID: data.game_id});
				}
			});
    }

    joinGame(){
        this.setState({joinGameInput: !this.state.joinGameInput});
    }

    changeValue(e){
        this.setState({gameIDtoJoin: e.target.value})
    }
    startGame(){
        this.props.history.push({
            pathname: '/Game',
            state: {
                gameID: this.state.gameID,
                mode: 'create'
            }
        })
    }
    searchGame(){
        this.setState({submitted: true})
        fetch('/api/search/game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ game_id: this.state.gameIDtoJoin }),
        }).then(res => res.json())
            .then(res => {
                console.log(res)
                if (res.result === 'fail') {
                    console.log('Game doesnt exist')
                    this.setState({gameExists: false, bothJoined: false})
                } else if (res.result === 'success') {
                    this.setState({gameExists: true})
                    if (res.online !== 2) {
                        this.props.history.push({
                            pathname: '/Game',
                            state: {
                                gameID: this.state.gameIDtoJoin,
                                mode: 'join'
                            }
                        })
                    } else {
                        this.setState({bothJoined: true})
                    }
                    
                }
            })
    }

    render(){
        let url = window.location.protocol + '//' + document.domain;
        if (window.location.port !== "") {
            url += ':' + window.location.port;
        }
        return(
            <div className="Parent">
                    <div className="Home">
                        <h1>
                            Stone-Paper-Scissor
                            <sup>Online</sup>
                        </h1>
                        <h2>Because why not ?</h2>
                        
                        <h3>Get Started</h3>
                        <div className="buttons">
                            <button 
                                className="createGameButton" 
                                onClick={()=> this.createGame()}>
                                    Create a new game
                            </button>
                            <button 
                                onClick={()=> this.joinGame()}>
                                    Join a game 
                            </button>
                        </div>
                        
                        { this.state.gameID === null ? null : 
                            <div className="createGame">
                                <h4>Game Created. Game ID :  {this.state.gameID}</h4>
                                <p>Ask the other player to enter this ID while Joining the game. Or use the link below :</p>
                                <a href={url + '/join/' + this.state.gameID}>{url}/join/{this.state.gameID}</a>
                                <br/>
                                <br/>
                                <button onClick={this.startGame}>Start Game</button>
                            </div>
                        }

                        { this.state.joinGameInput === false ? null : 
                            <div className="joinGame">
                                <input type="text" name="gameID" id="gameID" placeholder="Game ID"
                                onChange={this.changeValue}
                                />
                                <button onClick={this.searchGame}>Join</button>
                                <br/>
                                <div>
                                <br/><br/>

                                    {!this.state.bothJoined ? null : <h3>Both players have already joined.</h3>}

                                    {this.state.gameExists ? null : <h3>Game doesn't exist. Create one to start playing.</h3>}
                                    
                                </div>
                            </div>
                        }
                        <br/>
                    </div>
                <div className="footerHome">
                            <Link to="/Info">Learn More</Link>
                            <p>Designed and Developed by <a href="http://bit.ly/nikketan">Niketan Gulekar</a> &copy;2020</p>
                </div>
            </div>
        );
    }
}

export default Home;