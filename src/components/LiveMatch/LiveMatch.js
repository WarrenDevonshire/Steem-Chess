import React, { Component } from 'react';
import Chatbox from '../Chatbox/Chatbox';
import ChessGame from '../ChessGame/ChessGame';
import GameInfo from '../GameInfo/GameInfo';
import Timer from '../Timer/Timer';
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
        this.opponentTimerComponent = React.createRef();
        this.myTimerComponent = React.createRef();

        if(this.props.location.gameData != null) {
            this.gameData = this.props.location.gameData;
        }
        else {
            this.gameData = null;
        }

        this.sendPeerData = this.sendPeerData.bind(this);
        this.opponentTimesUp = this.opponentTimesUp.bind(this);
        this.myTimesUp = this.myTimesUp.bind(this); 
        this.gameDataParser = this.gameDataParser.bind(this);
    }

    componentWillUnmount() {
        if (this.peer !== null && this.peer !== undefined) {
            console.log("Destroying peer", this.peer);
            this.peer.destroy();
        }
    }

    async componentDidMount() {
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

        if(this.gameData.startingColor === "White") {
            this.myTimerComponent.current.start();
        }
        else {
            this.opponentTimerComponent.current.start();
        }

        if(DISABLE_BLOCKCHAIN) return;

        this.peer.on('data', (data) => {
            var parsedData = JSON.parse(data);
            if (parsedData.type === 'message') {
                this.chatboxComponent.current.onReceiveMessage(parsedData);
            }
            else if (parsedData.type === 'move') {
                this.chessGameComponent.current.onReceiveMove(parsedData);
                this.opponentTimerComponent.current.stop();
                this.opponentTimerComponent.current.addTime(this.gameDataParser(2));
                this.myTimerComponent.current.start();
            }
        });
    }

    /**
     * Sends data to the connected peer
     */
    sendPeerData(data) {
        if(data.type === "move") { //TODO make sure both players agree on timer times, and implement increments
            this.myTimerComponent.current.stop();
            this.myTimerComponent.current.addTime(this.gameDataParser(2));
            this.opponentTimerComponent.current.start();
        }
        
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

    /**
     * Called when the opponent's timer component reaches 0
     */
    opponentTimesUp() {
        console.log("Opponent time's up!!!");
        this.chessGameComponent.current.endGame();
        alert("You win!! Opponent ran out of time");
    }

    /**
     * Called when the local player's time reaches 0
     */
    myTimesUp() {
        console.log("My time's up!!!");
        this.chessGameComponent.current.endGame();
        alert("Sorry, you lose! You ran out of time");
    }

    gameDataParser(index) {
        if(this.gameData === null) return "";
        var data = this.gameData.typeID.split("|");
        if(data.length > index) return data[index];
    }

    render() {
        return (
            <div id="Match">
                <div id = "float-left">
                <GameInfo gameType={this.gameDataParser(0)} gameTime={this.gameDataParser(1)} increment={this.gameDataParser(2)} ranked={false}/>
                <Chatbox sendData={this.sendPeerData} ref={this.chatboxComponent} />
                </div>
                <ChessGame sendData={this.sendPeerData} ref={this.chessGameComponent} gameData={this.gameData}/>
                <div id="float-right">    
                <Timer timesUp={this.opponentTimesUp} ref={this.opponentTimerComponent} minutes={this.gameDataParser(1)}/>
                <Timer timesUp={this.myTimesUp} ref={this.myTimerComponent} minutes={this.gameDataParser(1)}/>
                </div>
            </div>
        )
    }
}

export default LiveMatch;