import React, { Component } from 'react';
import Chatbox from '../Chatbox/Chatbox';
import ChessGame from '../ChessGame/ChessGame';
import GameHistory from '../GameHistory/GameHistory';
import GameInfo from '../GameInfo/GameInfo';
import Timer from '../Timer/Timer';
import GameOptions from '../GameOptions/GameOptions'
import { loadState } from "../../components/localStorage";
import './LiveMatch.css';

const dsteem = require('dsteem');
const steemTransact = require('steem-transact');
const client = new dsteem.Client('https://api.steemit.com');

const GAME_ID = 'steem-chess-'
const MATCH_END_TAG = "game-ended";

const DISABLE_BLOCKCHAIN = false;

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
        this.gameHistoryComponent = React.createRef();
        this.gameOptionsComponent = React.createRef();
        this.gameFinished = false;

        if (this.props.location.gameData != null) {
            this.gameData = this.props.location.gameData;
        }
        else {
            this.gameData = null;
        }

        this.sendPeerData = this.sendPeerData.bind(this);
        this.opponentTimesUp = this.opponentTimesUp.bind(this);
        this.myTimesUp = this.myTimesUp.bind(this);
        this.addMoveToHistory = this.addMoveToHistory.bind(this);
        this.gameDataParser = this.gameDataParser.bind(this);
        this.stopTimers = this.stopTimers.bind(this);
        this.gameHasEnded = this.gameHasEnded.bind(this);
        this.drawClicked = this.drawClicked.bind(this);
        this.resignClicked = this.resignClicked.bind(this);
    }
    componentWillUnmount() {
        if (this.peer !== null && this.peer !== undefined) {
            this.peer.destroy();
        }
        this.stopTimers();
    }

    async componentDidMount() {
        var localDB = loadState();
        if (localDB.account == null) {
            console.log("Went to LiveMatch without logging in");
            this.props.history.push("/Login");
            return;
        }
        else {
            this.username = localDB.account;
            try {
                this.posting_key = dsteem.PrivateKey.fromString(localDB.key);
            }
            catch (e) {
                console.error(e);
            }
        }
        if (this.gameData == null) {
            this.props.history.push("/Play");
            console.error("LiveMatch not passed any game data!");
            return;
        }
        if (this.peer == null && !DISABLE_BLOCKCHAIN) {
            this.props.history.push("/Play");
            console.error("LiveMatch not passed a peer!");
            return;
        }

        if (this.gameData.startingColor === "White") {
            this.myTimerComponent.current.start();
        }
        else {
            this.opponentTimerComponent.current.start();
        }

        if (DISABLE_BLOCKCHAIN) return;

        this.peer.on('data', (data) => {
            var parsedData = JSON.parse(data);
            console.log("got peer data", parsedData);
            if (parsedData.type === 'message') {
                this.chatboxComponent.current.onReceiveMessage(parsedData);
            }
            else if (parsedData.type === 'move') {
                this.chessGameComponent.current.onReceiveMove(parsedData);
                this.opponentTimerComponent.current.pause();
                this.opponentTimerComponent.current.addTime(this.gameDataParser(2));
                this.myTimerComponent.current.start();
            }
            else if (parsedData.type === "draw request") {
                this.stopTimers();
                if (window.confirm("Opponent requested a draw. Do you want to accept?")) {
                    this.sendPeerData({type: "draw accepted"});
                }
                else {
                    this.sendPeerData({type: "draw denied"});
                }
            }
            else if(parsedData.type === "draw accepted") {
                this.gameHasEnded("sent draw")
            }
            else if(parsedData.type === "draw denied") {
                this.resumeTimers();
            }
            else if (parsedData.type === "resigned") {
                this.gameHasEnded("opponent resigned");
            }
        });
    }

    /**
     * Sends data to the connected peer
     */
    sendPeerData(data) {
        if (data.type === "move") { //TODO make sure both players agree on timer times
            this.myTimerComponent.current.pause();
            this.myTimerComponent.current.addTime(this.gameDataParser(2));
            this.opponentTimerComponent.current.start();
        }
        else if(data.type === "resigned") {
            this.gameHasEnded("resigned");
            alert('You have successfully resigned');
        }
        else if(data.type === "draw request") {
            this.stopTimers();
        }
        else if(data.type === "draw accepted") {
            this.gameHasEnded("accepted draw");
        }
        else if(data.type === "draw denied") {
            this.resumeTimers();
        }

        if (DISABLE_BLOCKCHAIN) return true;

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
        this.gameHasEnded("opponent timer ended");
        alert("You win!! Opponent ran out of time");
    }

    /**
     * Called when the local player's time reaches 0
     */
    myTimesUp() {
        this.gameHasEnded("my timer ended");
        alert("Sorry, you lose! You ran out of time");
    }

    addMoveToHistory(move, time) {
        this.gameHistoryComponent.current.addMove(move, time);
    }

    stopTimers() {
        if (this.myTimerComponent.current !== null)
            this.myTimerComponent.current.stop();
        if (this.opponentTimerComponent.current !== null)
            this.opponentTimerComponent.current.stop();
    }

    resumeTimers() {
        if (this.myTimerComponent.current !== null)
            this.myTimerComponent.current.start();
        if (this.opponentTimerComponent.current !== null)
            this.opponentTimerComponent.current.start();
    }

    gameHasEnded(endStatus) {
        console.log(this);
        this.gameFinished = true;
        this.gameOptionsComponent.current.gameFinished = true;
        this.chessGameComponent.current.endGame();
        this.stopTimers();

        if (DISABLE_BLOCKCHAIN) return;

        var endStatusString;
        if (endStatus === "checkmate won") {
            endStatusString = this.username + " beat " + this.props.opponentUsername;
        }
        else if (endStatus === "checkmate lost") {
            endStatusString = this.props.opponentUsername + " beat " + this.username;
        }
        else if (endStatus === "stalemate") {
            endStatusString = this.props.opponentUsername + " got in a stalemate with " + this.username;
        }
        else if (endStatus === "my timer ended") {
            endStatusString = this.username + " ran out of time";
        }
        else if (endStatus === "opponent timer ended") {
            endStatusString = this.props.opponentUsername + " ran out of time";
        }
        else if (endStatus === "resigned") {
            endStatusString = this.props.opponentUsername + " resigned in game with " + this.username;
        }
        else if (endStatus === "opponent resigned") {
            endStatusString = this.username + " resigned in game with " + this.props.opponentUsername;
        }
        else if (endStatus === "sent draw") {
            endStatusString = this.props.opponentUsername + " accepted draw from " + this.username;
        }
        else if (endStatus === "accepted draw") {
            endStatusString = this.username + " accepted draw from " + this.props.opponentUsername;
        }
        var matchData = {
            endStatus: endStatusString,
            history: this.chessGameComponent.current.getGameHistory()
        }

        var transactor = steemTransact(client, dsteem, GAME_ID);
        transactor.json(this.username, this.posting_key.toString(), MATCH_END_TAG, matchData,
            (err, _) => {
                if (err) {
                    console.error(err);
                }
            });
    }

    drawClicked() {
        this.sendPeerData({type: "draw request"});
    }

    resignClicked() {
        this.sendPeerData({type: "resigned"});
    }

    gameDataParser(index) {
        if (this.gameData === null) return "";
        var data = this.gameData.typeID.split("|");
        if (data.length > index) return data[index];
    }

    render() {
        return (
            <div id="Match">
                <div id="float-left">
                    <GameInfo gameType={this.gameDataParser(0)} gameTime={this.gameDataParser(1)} increment={this.gameDataParser(2)} ranked={false} />
                    <Chatbox sendData={this.sendPeerData} ref={this.chatboxComponent} />
                </div>
                <div id="middle-div">
                    <ChessGame sendData={this.sendPeerData} addMoveToHistory={this.addMoveToHistory} ref={this.chessGameComponent} gameData={this.gameData} gameEnded={this.gameHasEnded} />
                </div>
                <div id="float-right">
                    <Timer timesUp={this.myTimesUp} ref={this.myTimerComponent} minutes={this.gameDataParser(1)} />
                    <Timer timesUp={this.opponentTimesUp} ref={this.opponentTimerComponent} minutes={this.gameDataParser(1)} />
                    <GameOptions ref={this.gameOptionsComponent} drawClicked={this.drawClicked} resignClicked={this.resignClicked} />
                    <GameHistory ref={this.gameHistoryComponent} />
                </div>
            </div>
        )
    }
}

export default LiveMatch;