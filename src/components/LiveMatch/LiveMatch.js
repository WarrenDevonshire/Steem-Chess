
import React, { Component } from 'react';
import ChessGame from '../ChessGame/ChessGame';
import Chatbox from '../Chatbox/Chatbox'
import GameInfo from '../GameInfo/GameInfo'

export default class LiveMatch extends Component {
    constructor(props) {
        super(props)
        this.state = {
            gameType: "Blitz",
            gameTime: 15,
            increment: 5,
            ranked: false,
            black: "FishPawn",
            white: "CatPawn"
        }
        
    }
    componentDidMount(){
        this.setState({gameType});
    }
    render() {

        return (

            <div id="liveMatch">
                <ChessGame />
                <Chatbox />
                <GameInfo gameType={this.state.gameType}
                    gameTime={this.state.gameTime}
                    increment={this.state.increment}
                    ranked={this.state.ranked}
                    black={this.state.black}
                    white={this.state.white}/>
            </div>

        )

    }

}

function gameType(text){
    this.setState({gameType})
}

