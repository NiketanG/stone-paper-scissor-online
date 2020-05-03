import React, { Component } from "react";

class Join extends Component {
    componentDidMount(){
        fetch('/api/search/game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ game_id: this.props.match.params.id }),
        }).then(res => res.json())
            .then(res => {
                if (res.result === 'fail') {
                    this.props.history.push({
                        pathname: '/'
                    })
                } else if (res.result === 'success') {
					this.props.history.replace({
                        pathname: '/Game',
                        state: {
                            gameID : this.props.match.params.id,
                            mode: 'join'
                        }
                    })
                }
            })
    }

    render() {
        return(
            <div>
                <h1>Joining Game</h1>
                <h2>Game ID : {this.props.match.params.id}</h2>
            </div>
        )
    }
}

export default Join;