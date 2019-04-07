import React, { Component } from 'react';
import Chatbox from '../Chatbox/Chatbox';
import ChessGame from '../ChessGame/ChessGame';
import Peer from 'simple-peer';
import { loadState } from "../../components/localStorage";

const GAME_ID = 'steem-chess'
const dsteem = require('dsteem');
const steemState = require('steem-state');
const steemTransact = require('steem-transact');
const client = new dsteem.Client('https://api.steemit.com');

/**
 * Component for playing a live chess match. Must
 * be passed in the game data and if this user
 * is initiating the webRTC connection
 */
class LiveMatch extends Component {
    constructor(props) {
        super(props);

        var localDB = loadState();
        const pKey = dsteem.PrivateKey.fromLogin(localDB.account, localDB.key, 'posting');

        this.state = {
            gameData: this.props.location.gameData,
            waitingPlayer: null,
            processor: null,
            transactor: steemTransact(client, dsteem, GAME_ID),
            peer: null,
            username: localDB.account,
            posting_key: pKey
        }
        this.chatboxComponent = React.createRef();
        this.chessGameComponent = React.createRef();

        this.sendPeerData = this.sendPeerData.bind(this);
    }

    componentWillUnmount() {
        if(this.state.processor !== null) {
            this.state.processor.stop();
        }
        if(this.state.peer !== null) {
            this.state.peer.destroy();
        }
    }

    async componentDidMount() {
        if(this.state.username == null) {
            this.props.history.push("/Login");
            return;
        }
        if (this.state.gameData == null) {
            this.props.history.push("/Play");
            console.error("LiveMatch not passed any game data!");
            return;
        }
        console.log(this.state.gameData);
        this.setState({waitingPlayer:this.props.location.waitingPlayer});
        console.log("waiting player: " + this.state.waitingPlayer);
        // didn't select a match to join
        if(this.props.location.waitingPlayer == null) {
            var opponent = await this.findWaitingPlayer(this.state.gameData);
            console.log("OPPONENT", opponent);
            this.setState({waitingPlayer:opponent});
        }
        // didn't find an existing game to join
        if (this.state.waitingPlayer == null) {
            this.postGameRequest(this.state.gameData);
        }
        else {
            this.sendGameRequest(this.state.waitingPlayer, this.state.gameData);
        }
    }

    /**
     * Checks if a game has recently been requested with the same data
     * @param {*} gameData 
     */
    async findWaitingPlayer(gameData) {//TODO won't filter out players that have already joined a game
        var headBlockNumber = await this.props.location.findBlockHead(client);
        await this.setState({processor:steemState(client, dsteem, Math.max(0, headBlockNumber - 25), 1, GAME_ID, 'latest')});
        return new Promise((resolve, reject) => {
            try {
                this.state.processor.on(gameData.typeID, (json, from) => {
                    console.log("Game block found", json);
                    if (this.matchableGames(gameData, json.data)) {
                        console.log("Found an opponent!!!", from);
                        this.state.processor.stop();
                        resolve(from);
                    }
                });
                this.state.processor.onBlock((block) => {
                    //Finish processing
                    if(block === headBlockNumber) {
                        this.state.processor.stop();
                        console.log("Didn't find a waiting opponent:(");
                        resolve(null);//Didn't find any players
                    }
                });
                this.state.processor.start();
            } catch (err) {
                console.error(err)
                this.state.processor.stop();
                return reject("Failed to check for waiting players");
            }
        });
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
    sendGameRequest(username, gameData) {
        console.log("sending request to existing game");
        this.state.transactor.json(this.state.username, this.state.posting_key.toString(), 'request-join', {
            data: gameData,
            sendingTo: username
        }, (err, result) => {
            if (err) {
                console.error(err);
                alert("Failed to send game request");
            }
            else if (result) {
                console.log("sent request to existing game", gameData);
                this.initializePeer(false, username, gameData);
            }
        });
    }

    /**
     * Puts game request onto the blockchain
     * @param {*} gameData 
     */
    postGameRequest(gameData) {
        console.log("posting a new game request");
        this.state.transactor.json(this.state.username, this.state.posting_key.toString(), gameData.typeID, {
            data: gameData
        }, (err, result) => {
            if (err) {
                console.error(err);
                alert("Failed to request game");
            }
            else if (result) {
                console.log("posted game request", result);
                this.state.processor = steemState(client, dsteem, result.block_num, 100, GAME_ID);
                try {
                    this.state.processor.on('request-join', (json, from) => {
                        if (json.userID === gameData.userID) {
                            this.initializePeer(true, from, gameData);
                        }
                        else {
                            console.error("Opponent tried to connect with incorrect game data", json.data, gameData);
                        }
                    });
                    this.state.processor.start();
                } catch(err) {
                    console.error(err);
                    this.state.processor.stop();
                    alert("Game request failed");
                }
            }
        });
    }

    /**
     * Creates a new peer
     * @param {bool} initializingConnection True if this peer is creating 
     * @param {string} otherUsername The opponent's username
     * the offer
     */
    async initializePeer(initializingConnection, otherUsername, gameData) {
        var receivingTag;
        var sendingTag;
        if(initializingConnection === true) {
            receivingTag = 'join-signal-i';
            sendingTag = 'join-signal-ni';
        }
        else {
            sendingTag = 'join-signal-i';
            receivingTag = 'join-signal-ni';
        }
        console.log("starting initializePeer");
        await this.setState({peer:new Peer({ initiator: initializingConnection, trickle: false })});
        this.state.peer.on('error', (err) => {
            console.error(err)
            alert("Failed to connect to opponent :(");
        });

        this.state.peer.on('signal', (data) => {
            this.sendSignalToUser(sendingTag, data);
            console.log("received a signal", JSON.stringify(data));
        });

        this.state.peer.on('data', (data) => {
            console.log(data)
            var parsedData = JSON.parse(data); //////////////////////////////////////////////////////////////////////
            console.log(parsedData)
            if(parsedData.type === 'message') {
                this.chatboxComponent.current.onReceiveMessage(parsedData);
            }
            else if(parsedData.type === 'move') {
                console.log("CALLED")
                this.chessGameComponent.current.onReceivedMove(parsedData);
            }
        });

        this.state.peer.on('connect', () => {
            if (initializingConnection === true) {
                this.state.transactor.json(this.state.username, this.state.posting_key.toString(), 'request-closed', {
                    data: gameData
                }, (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            }
            console.log('Connected to peer!!!');
        });

        var headerBlockNumber = await this.props.location.findBlockHead(client);
        await this.setState({processor:steemState(client, dsteem, headerBlockNumber, 100, GAME_ID)});
        this.state.processor.on(receivingTag, (signal) => {
            if(this.state.peer !== null) {
                this.state.peer.signal(signal.signal);
            }
        });
        this.state.processor.start();
    }

    /**
     * Sends a webRTC signal to the opponent through the blockchain
     * @param {string} username 
     * @param {*} signal 
     */
    sendSignalToUser(sendingTag, signal) {
        console.log("starting sendSignalToUser");
        this.state.transactor.json(this.state.username, this.state.posting_key.toString(), sendingTag, {
            signal: signal,
            from: this.state.username
        }, (err, success) => {
            if (err) {
                console.error(err);
                alert("Failed opponent connection process");
            }
        });
    }
    sendPeerData(data) {
        if (this.state.peer == null) {
            var error = "Peer connection not initiated!";
            console.error(error);
            alert(error);
            return false;
        }
        if (!this.state.peer.connected) {
            var error = "Not connected to the other player yet!";
            console.error(error);
            alert(error);
            return false;
        }
        this.state.peer.send(JSON.stringify(data));
        return true;
    }
    render() {
        return (
            <div id="liveMatch">
                <ChessGame peer={this.state.peer} sendData={this.sendPeerData} ref={this.chessGameComponent}/>
                <Chatbox peer={this.state.peer} sendData={this.sendPeerData} ref={this.chatboxComponent} />
            </div>
        )
    }

}

export default LiveMatch;