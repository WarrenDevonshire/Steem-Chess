import React, { Component } from 'react';
import Chatbox from '../Chatbox/Chatbox';
import ChessGame from '../ChessGame/ChessGame';
import Peer from 'simple-peer';
import { loadState } from "../../components/localStorage";

const dsteem = require('dsteem');
const steemState = require('steem-state');
const steemTransact = require('steem-transact');
const client = new dsteem.Client('https://api.steemit.com');

//Blockchain message tags
const GAME_ID = 'steem-chess'
const POST_GAME_TAG = 'post-game'
const JOIN_TAG = 'request-join';
const PEER_INIT_TAG = 'join-signal-i';
const PEER_NOT_INIT_TAG = 'join-signal-ni';
//const CLOSE_REQUEST_TAG = 'request-closed';

/**
 * Component for playing a live chess match. Must
 * be passed in the game data and if this user
 * is initiating the webRTC connection
 */
class LiveMatch extends Component {
    constructor(props) {
        super(props);

        var localDB = loadState();

        this.gameData = this.props.location.gameData;
        this.transactor = steemTransact(client, dsteem, GAME_ID);
        this.processor = null;
        this.username = localDB.account;
        this.posting_key = "5JQPAmzYzzzKK5tGdyrvdq4dp1bu7ExUAyx6AjfnRoz7cG1LLox";//localDB.key;
        this.peer = null;
        this.chatboxComponent = React.createRef();
        this.chessGameComponent = React.createRef();

        //Game requests found on the blockchain
        this.gameRequestBlocks = [];
    }

    componentWillUnmount() {
        if (this.processor !== null) {
            this.processor.stop();
        }
        if (this.peer !== null) {
            console.log("Destroying peer");
            this.peer.destroy();
        }
    }

    async componentDidMount() {
        if (this.username == null) {
            this.history.push("/Login");
            return;
        }
        if (this.gameData == null) {
            this.props.history.push("/Play");
            console.error("LiveMatch not passed any game data!");
            return;
        }
        console.log(this.gameData);
        //didn't select a match to join
        if (this.props.location.opponentUsername == null && this.props.opponentGameData == null) {
            this.findWaitingPlayers();
            //If opponent not found after 15 seconds, post a game request
            setTimeout(() => {
                this.checkWaitingPlayers()
            }, 15000);
        }
        else {
            this.sendGameRequest(this.props.location.opponentUsername, this.props.location.opponentGameData);
        }
    }

    checkWaitingPlayers() {
        if (this.processor !== null) {
            this.processor.stop();
        }
        console.log(this.gameRequestBlocks);
        var opponent = null;
        if(this.gameRequestBlocks.length > 0) {
            var waitingPlayers = []
            for (var i = this.gameRequestBlocks.length - 1; i >= 0; --i) {
                //TODO check that the user is not the same as the current person once testing is complete
                var currentBlock = this.gameRequestBlocks[i];
                //If the user hasn't already made a newer game request, and the 
                //request was made less than 5 minutes ago
                if(!waitingPlayers.includes(currentBlock.username) && 
                   ((new Date()) - currentBlock.gameData.time) < (1000*60*5)) {
                    waitingPlayers.push(currentBlock);
                }
                else {
                    console.log("--------------------------");
                    console.log(((new Date()) - currentBlock.gameData.time) < (1000*60*5));
                    console.log(!waitingPlayers.includes(currentBlock.username));
                    console.log("--------------------------");
                }
                if(waitingPlayers.length > 0) {
                    opponent = waitingPlayers[0];
                }
            }
        }
        //didn't find an existing game to join
        if (opponent == null) {
            this.postGameRequest();
        }
        else {
            this.sendGameRequest(opponent.username, opponent.gameData);
        }
    }

    /**
     * Checks if a game has recently been requested with the same data
     * @param {*} gameData
     */
    async findWaitingPlayers() {//TODO won't filter out players that have already joined a game
        var headBlockNumber = await this.props.location.findBlockHead(client);
        this.processor = steemState(client, dsteem, Math.max(0, headBlockNumber - 100), 1, GAME_ID, 'latest');
        try {
            this.processor.on(POST_GAME_TAG, (json, from) => {
                console.log("Game block found", json);
                if (this.matchableGames(this.gameData, json.data)) {
                    this.gameRequestBlocks.push({ 
                        gameData:json, 
                        username:from });
                }
            });
            this.processor.start();
        } catch (err) {
            console.error(err)
            if (this.processor !== null)
                this.processor.stop();
            console.error("Failed to check for waiting players");
        }
    }

    /**
     * Checks if two games are compatable
     * @param {*} first
     * @param {*} second
     */
    matchableGames(first, second) {
        if (first.timeControlChosen !== second.timeControlChosen ||
            first.timePerSide !== second.timePerSide ||
            first.increment !== second.increment)
            return false;
        return first.startingColor === "Random" || first.startingColor !== second.startingColor;
    }

    /**
     * Requests to start RTC with a user
     * @param {string} username The opponent's username
     * @param {*} gameData
     */
    sendGameRequest(username, opponentGameData) {
        console.log("sending request to existing game");
        this.decideRandom(opponentGameData);
        this.transactor.json(this.username, this.posting_key.toString(), JOIN_TAG, {
            data: this.gameData,
            sendingTo: username
        }, (err, result) => {
            if (err) {
                console.error(err);
                alert("Failed to send game request");
            }
            else if (result) {
                console.log("sent request to existing game", this.gameData);
                this.initializePeer(false);
            }
        });
    }

    /**
     * Decides on random starting color for this.gameData
     */
    decideRandom(opponentGameData) {
        if (this.gameData.startingColor === "Random") {
            if (opponentGameData.startingColor === "Black") {
                this.gameData.startingColor = "White";
            }
            else if (opponentGameData.startingColor === "White") {
                this.gameData.startingColor = "Black";
            }
            else {
                //TODO make a random choice
                this.gameData.startingColor = "White";
            }
        }
    }

    /**
     * Puts game request onto the blockchain
     * @param {*} gameData
     */
    postGameRequest() {
        console.log("posting a new game request");
        this.transactor.json(this.username, this.posting_key.toString(), POST_GAME_TAG, {
            data: this.gameData
        }, (err, result) => {
            if (err) {
                console.error(err);
                alert("Failed to request game");
            }
            else if (result) {
                console.log("posted game request", result);
                this.processor = steemState(client, dsteem, result.block_num, 100, GAME_ID);
                try {
                    this.processor.on(JOIN_TAG, (json) => {
                        if (json.userID === this.gameData.userID) {
                            this.decideRandom(json.data);
                            this.initializePeer(true);
                        }
                        else {
                            console.error("Opponent tried to connect with incorrect game data", json.data, this.gameData);
                        }
                    });
                    this.processor.start();
                } catch (err) {
                    console.error(err);
                    if (this.processor !== null)
                        this.processor.stop();
                    alert("Game request failed");
                }
            }
        });
    }

    /**
     * Creates a new peer
     * @param {bool} initializingConnection True if this peer is creating the offer
     * the offer
     */
    async initializePeer(initializingConnection) {
        var receivingTag = initializingConnection === true ? PEER_INIT_TAG : PEER_NOT_INIT_TAG;
        var sendingTag = initializingConnection === true ? PEER_NOT_INIT_TAG : PEER_INIT_TAG;

        console.log("starting initializePeer");
        this.peer = new Peer({ initiator: initializingConnection, trickle: false });
        this.peer.on('error', (err) => {
            console.error(err)
            alert("Failed to connect to opponent :(");
        });

        this.peer.on('signal', (data) => {
            this.sendSignalToUser(sendingTag, data);
            console.log("received a signal", JSON.stringify(data));
        });

        this.peer.on('data', (data) => {
            var parsedData = JSON.parse(data);
            if (parsedData.type === 'message') {
                this.chatboxComponent.current.onReceiveMessage(parsedData);
            }
            else if (parsedData.type === 'move') {
                this.chatboxComponent.current.onReceiveMove(parsedData);
            }
        });

        this.peer.on('connect', () => {
            if (initializingConnection === true) {
                //TODO currently not used, so it is commented out to save on RC cost
                // this.transactor.json(this.username, this.posting_key.toString(), CLOSE_REQUEST_TAG, {
                //     data: this.gameData
                // }, (err) => {
                //     if (err) {
                //         console.error(err);
                //     }
                // });
            }
            console.log('Connected to peer!!!');
        });

        var headerBlockNumber = await this.props.location.findBlockHead(client);
        this.processor = steemState(client, dsteem, headerBlockNumber, 100, GAME_ID);
        this.processor.on(receivingTag, (signal) => {
            if (this.peer !== null) {
                this.peer.signal(signal.signal);
            }
        });
        this.processor.start();
    }

    /**
     * Sends a webRTC signal to the opponent through the blockchain
     * @param {string} username
     * @param {*} signal
     */
    sendSignalToUser(sendingTag, signal) {
        console.log("starting sendSignalToUser");
        this.transactor.json(this.username, this.posting_key.toString(), sendingTag, {
            signal: signal,
            from: this.username
        }, (err) => {
            if (err) {
                console.error(err);
                alert("Failed opponent connection process");
            }
        });
    }

    sendPeerData(data) {
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
            <div id="liveMatch">
                <ChessGame sendData={this.sendPeerData} ref={this.chessGameComponent} />
                <Chatbox sendData={this.sendPeerData} ref={this.chatboxComponent} />
            </div>
        )
    }

}

export default LiveMatch;
