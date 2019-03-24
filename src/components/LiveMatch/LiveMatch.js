
import React, { Component } from 'react';
import Chatbox from '../Chatbox/Chatbox'
import Peer from 'simple-peer';
import GameInfo from '../GameInfo/GameInfo'

/**
 * Component for playing a live chess match. Must
 * be passed in the game data and if this user
 * is initiating the webRTC connection
 */
class LiveMatch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            peer: new Peer({initiator: this.props.isInitiating, trickle: false}),

            //test data
            rtcText: "",

            //gameinfo
            gameType: "Blitz",
            gameTime: 15,
            increment: 5,
            ranked: false,
            black: "FishPawn",
            white: "CatPawn"
        }

        console.log(this.props.isInitiating);

        this.state.peer.on('error', (err) => {
            console.log('error', err)
        });

        this.state.peer.on('signal', (data) => {
            console.log(JSON.stringify(data));
        });

        this.state.peer.on('connect', () => {
            console.log('CONNECT', this.state);
        });

        //Test methods
        this.testChanged = this.testChanged.bind(this);
        this.testClick = this.testClick.bind(this);
        //End test methods
    }

    //Test methods

    testChanged(e) {
        this.setState({rtcText: e.target.value});
    }

    testClick() {
        this.state.peer.signal(this.state.rtcText);
    }

    //End test methods

    render() {

        return (

            <div id="liveMatch">
                {/* For testing rtc */}
                <textarea onChange={e => this.testChanged(e)}/>
                <button onClick={e => this.testClick()}>TESTTTT</button>
                {/* End testing area */}
                {/* <ChessGame/> */}
                <Chatbox peer={this.state.peer}/>
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

export default LiveMatch;
