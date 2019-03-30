
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
            waitingPlayer: null,
            processor: null,
            transactor: steemTransact(client, dsteem, GAME_ID),
        }
    }

    async componentDidMount() {
        console.log(this.state.gameData);
        this.setState({waitingPlayer:this.props.location.waitingPlayer});
        console.log("waiting player: " + this.state.waitingPlayer);
        if (this.state.gameData == null) {
            console.error("LiveMatch not passed any game data!");
            return;
        }
        //didn't select a match to join
        if(this.props.location.waitingPlayer == null) {
            var opponent = await this.findWaitingPlayer(this.state.gameData);
            console.log("OPPONENT", opponent);
            this.setState({waitingPlayer:opponent});
        }
        //didn't find an existing game to join
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
        await this.setState({processor:steemState(client, dsteem, Math.max(0, headBlockNumber - 1000), 5, GAME_ID, 'latest')});
        return new Promise((resolve, reject) => {
            try {
                this.state.processor.on('request-open', (json, from) => {
                    console.log("request-open block found!!!!!!!!!!!!!!!!!!!!!!", json);
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
        if (first.startingColor === "Random" || first.startingColor !== second.startingColor)
            return true;
        return first.timeControlChosen === second.timeControlChosen &&
            first.timePerSide === second.timePerSide &&
            first.increment === second.increment;
    }

    /**
     * Requests to start RTC with a user
     * @param {*} username The opponent's username
     * @param {*} gameData
     */
    sendGameRequest(username, gameData) {
        console.log("starting sendGameRequest");
        this.state.transactor.json(USERNAME, POSTING_KEY.toString(), 'request-join', {
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
        console.log("starting postGameRequest");
        this.state.transactor.json(USERNAME, POSTING_KEY.toString(), 'request-open', {
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
        console.log("starting initializePeer");
        await this.setState({peer:new Peer({ initiator: initializingConnection, trickle: false })});
        this.state.peer.on('error', (err) => {
            console.error('error', err)
        });

        this.state.peer.on('signal', (data) => {
            this.sendSignalToUser(otherUsername, data);
            console.log("received a signal", JSON.stringify(data));
        });

        this.state.peer.on('connect', () => {
            if (initializingConnection === true) {
                this.state.transactor.json(USERNAME, POSTING_KEY.toString(), 'request-closed', {
                    data: gameData
                }, (err, result) => {
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

        var headerBlockNumber = await this.props.location.findBlockHead(client);
        await this.setState({processor:steemState(client, dsteem, headerBlockNumber, 100, GAME_ID)});
        this.state.processor.on('join-signal', (signal) => {
            this.state.peer.signal(JSON.parse(signal.data));
        });
        this.state.processor.start();
    }

    /**
     * Sends a webRTC signal to the opponent through the blockchain
     * @param {string} username 
     * @param {*} signal 
     */
    sendSignalToUser(username, signal) {
        return;
        console.log("starting sendSignalToUser");
        this.state.transactor.json(USERNAME, POSTING_KEY.toString(), 'join-signal', {
            signal: signal
        }, (err, result) => {
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