
import React, { Component } from 'react';
import Chatbox from '../Chatbox/Chatbox'
import Peer from 'simple-peer';

//TEMP unitl local data storage
const GAME_ID = 'steem-chess'
const dsteem = require('dsteem');
const steemState = require('steem-state');
const steemTransact = require('steem-transact');
const client = new dsteem.Client('https://api.steemit.com');
const USERNAME = "mdhalloran"
const POSTING_KEY = dsteem.PrivateKey.fromLogin(USERNAME, "P5KEH4V4eKrK2WWxnSGw7UQGSD2waYSps3xtpf9ajegc46PGRUzN", 'posting')

/**
 * Component for playing a live chess match. Must
 * be passed in the game data and if this user
 * is initiating the webRTC connection
 */
class LiveMatch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameData: this.props.location.gameData,
            waitingPlayer: null
        }
        
    }

    async componentDidMount() {
        if(this.props.location.waitingPlayer == null)
        {
            console.error("No data was passed in!");
            return;
        }
        console.log(this.state.gameData);
        var waiting = await this.props.location.waitingPlayer();
        this.setState({waitingPlayer:waiting});
        console.log("waiting player: " + this.state.waitingPlayer);
        if (this.state.gameData == null) {
            console.error("LiveMatch not passed any game data!");

        }
        else {
            if (this.state.waitingPlayer == null) {
                console.log(this.state.gameData);
                this.postGameRequest(this.state.gameData);
            }
            else {
                this.sendGameRequest(this.state.waitingPlayer, this.state.gameData);
            }
        }
    }

    /**
     * Requests to start RTC with a user
     * @param {*} username The opponent's username
     * @param {*} gameData
     */
    sendGameRequest(username, gameData) {
        console.log("starting sendGameRequest");
        var transactor = steemTransact(client, dsteem, GAME_ID);
        transactor.json(USERNAME, POSTING_KEY, 'request-join', {
            data: gameData,
            sendingTo: username
        }, function (err, result) {
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
        console.log("starting postGameRequest");
        var transactor = steemTransact(client, dsteem, GAME_ID);
        transactor.json(USERNAME, POSTING_KEY.toString(), 'request-open', {
            data: gameData
        }, function (err, result) {
            if (err) {
                console.error(err);
                alert("Failed to request game");
            }
            else if (result) {
                console.log("send request", result);
                var processor = steemState(client, dsteem, result.head_block_number, 100, GAME_ID);
                try{
                    processor.on('request-join', function (json, from) {
                        if (json.userID === gameData.userID) {
                            this.initializePeer(true, from, gameData);
                        }
                        else {
                            console.error("Opponent tried to connect with incorrect game data", json.data, gameData);
                        }
                    });
                    processor.start();
                } catch(err) {
                    console.error(err);
                    processor.stop();
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
        console.log("starting initializePeer");
        this.state.peer = new Peer({ initiator: initializingConnection, trickle: false });

        this.state.peer.on('error', (err) => {
            console.log('error', err)
        });

        this.state.peer.on('signal', (data) => {
            this.sendSignalToUser(otherUsername, data);
            console.log("received a signal", JSON.stringify(data));
        });

        this.state.peer.on('connect', () => {
            if (initializingConnection === true) {
                var transactor = steemTransact(client, dsteem, GAME_ID);
                transactor.json(USERNAME, POSTING_KEY, 'request-closed', {
                    data: gameData
                }, function (err, result) {
                    if (err) {
                        console.error(err);
                        alert("Failed opponent connection process");
                    }
                    else if (result) {
                        console.log('Connected to peer');
                    }
                });
            }
        });

        var headerBlock = await this.props.findBlockHead(client);
        var processor = steemState(client, dsteem, headerBlock, 100, GAME_ID);
        processor.on('join-signal', function (signal) {
            this.state.peer.signal(JSON.parse(signal.data));
        });
        processor.start();
    }

    /**
     * Sends a webRTC signal to the opponent through the blockchain
     * @param {string} username 
     * @param {*} signal 
     */
    sendSignalToUser(username, signal) {
        return;
        console.log("starting sendSignalToUser");
        var transactor = steemTransact(client, dsteem, GAME_ID);
        transactor.json(USERNAME, POSTING_KEY, 'join-signal', {
            signal: signal
        }, function (err, result) {
            if (err) {
                console.error(err);
                alert("Failed opponent connection process");
            }
        });
    }

    render() {
        return (
            <div id="liveMatch">
                {/* <ChessGame/> */}
                <Chatbox peer={this.state.peer} />
            </div>
        )
    }

}

export default LiveMatch;