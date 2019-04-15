import React, { Component } from 'react';
import Chatbox from '../Chatbox/Chatbox';
import ChessGame from '../ChessGame/ChessGame';
import { loadState } from "../../components/localStorage";
import './LiveMatch.css';

const DISABLE_BLOCKCHAIN = true;

/**
 * Component for playing a live chess match
 */
class LiveMatch extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);

        this.peer = this.props.location.peer;
        this.chatboxComponent = React.createRef();
        this.chessGameComponent = React.createRef();

        if(this.props.location.gameData != null) {
            this.gameData = this.props.location.gameData;
        }
        else {
            this.gameData = null;
        }

        this.sendPeerData = this.sendPeerData.bind(this);
    }

    componentWillUnmount() {
        if (this.peer !== null && this.peer !== undefined) {
            console.log("Destroying peer", this.peer);
            this.peer.destroy();
        }
    }

    async componentDidMount() {
        console.log("cdm");
        console.log(this);

        var localDB = loadState();
        if(localDB.account == null) {
            console.log("Went to LiveMatch without logging in");
            this.props.history.push("/Login");
            return;
        }
        if (this.gameData == null) {
            this.props.history.push("/Play");
            console.error("LiveMatch not passed any game data!");
            return;
        }
        if(this.peer == null && !DISABLE_BLOCKCHAIN) {
            this.props.history.push("/Play");
            console.error("LiveMatch not passed a peer!");
            return;
        }

        if(DISABLE_BLOCKCHAIN) return;

        this.peer.on('data', (data) => {
            var parsedData = JSON.parse(data);
            if (parsedData.type === 'message') {
                this.chatboxComponent.current.onReceiveMessage(parsedData);
            }
            else if (parsedData.type === 'move') {
                this.chatboxComponent.current.onReceiveMove(parsedData);
            }
        });
    }

    /**
     * Sends data to the connected peer
     */
    sendPeerData(data) {
        if(DISABLE_BLOCKCHAIN) return true;
        
        if (this.peer == null) {
            console.error("Peer connection not initiated!");
            alert("Peer connection not initiated!");
            return false;
        }
        if (!this.peer.connected) {
            console.error("Not connected to the other player yet!");
            alert("Not connected to the other player yet!");
            return false;
        }
        this.peer.send(JSON.stringify(data));
        return true;
    }

    render() {
        return (
            <div id=".Match">
                <ChessGame sendData={this.sendPeerData} ref={this.chessGameComponent} gameData={this.gameData}/>
                <Chatbox sendData={this.sendPeerData} ref={this.chatboxComponent} />
            </div>
        )
    }
}

export default LiveMatch;