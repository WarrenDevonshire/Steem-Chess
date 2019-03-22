
import React, { Component } from 'react';
import Chatbox from '../Chatbox/Chatbox'
import Peer from 'simple-peer';

/**
 * Component for playing a live chess match. Must
 * be passed in the game data and if this user
 * is initiating the webRTC connection
 */
class LiveMatch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            peer: new Peer({ initiator: this.props.isInitiating, trickle: false }),

            //test data
            rtcText: ""
        }

        console.log(this.props.isInitiating);

        this.state.peer.on('error', (err) => { 
            console.log('error', err) 
        });

        this.state.peer.on('signal', (data) => {
            console.log('SIGNAL', JSON.stringify(data));
        });

        this.state.peer.on('connect', () => {
            console.log('CONNECT', this.state);
            this.state.peer.send('whatever' + Math.random())
        });

        this.state.peer.on('data', (data) => {
            console.log('data: ' + data);
        });

        //Test methods
        this.testChanged = this.testChanged.bind(this);
        this.testClick = this.testClick.bind(this);
        //End test methods
    }

    //Test methods

    testChanged(e) {
        this.setState({ rtcText: e.target.value });
    }

    testClick() {
        this.state.peer.signal(this.state.rtcText);
    }

    //End test methods

    render() {

        return (

            <div id="liveMatch">
                {/* For testing rtc */}
                <textarea onChange={e => this.testChanged(e)} />
                <button onClick={e => this.testClick()}>TESTTTT</button>
                {/* End testing area */}
                {/* <ChessGame/> */}
                <Chatbox localConnection={this.props.localConnection} />
            </div>

        )

    }

}

export default LiveMatch;