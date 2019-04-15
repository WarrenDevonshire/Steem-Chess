import React, { Component } from 'react';
import './Play.css';
import JoinGameBox from '../JoinGameBox/JoinGameBox';
import CreateGameBox from "../CreateGameBox/CreateGameBox";
import Peer from 'simple-peer';
import { loadState } from "../../components/localStorage";
import PubSub from 'pubsub-js';

const dsteem = require('dsteem');
const steemState = require('steem-state');
const steemTransact = require('steem-transact');
const client = new dsteem.Client('https://api.steemit.com');
const maxWaitingTime = 1000 * 60 * 5;

//Blockchain message tags
const GAME_ID = 'steem-chess'
const POST_GAME_TAG = 'post-game'
const JOIN_TAG = 'request-join';
const PEER_INIT_TAG = 'join-signal-i';
const PEER_NOT_INIT_TAG = 'join-signal-ni';
const CLOSE_REQUEST_TAG = 'request-closed';

const DISABLE_BLOCKCHAIN = true;//Used for testing purposes. Allows developer to go to chess page without communicating with blockchain

class Play extends Component {
    constructor(props) {
        super(props);

        this.transactor = steemTransact(client, dsteem, GAME_ID);
        this.processor = null;
        this.username = null;
        this.posting_key = null;
        this.peer = null;

        this.createGameComponent = React.createRef();
        this.joinGameComponent = React.createRef();

        this.gameRequestBlocks = [];
        this.closeRequestBlocks = [];

        this.findBlockHead = this.findBlockHead.bind(this);
        this.createGameClicked = this.createGameClicked.bind(this);
        this.joinGameClicked = this.joinGameClicked.bind(this);
    }

    componentWillUnmount() {
        if (this.processor !== null) {
            this.processor.stop();
        }
        PubSub.publish('spinner', { spin: false });
    }

    componentDidMount() {
        var localDB = loadState();
        if (localDB.account == null) {
            this.props.history.push("/Login");
            return;
        }
        this.username = localDB.account;
        this.posting_key = dsteem.PrivateKey.fromLogin(this.username, localDB.key, 'posting').toString();
    }

    /**
     * Finds the most recent block number
     * @param {*} client The dsteem client
     */
    async findBlockHead(client) { //TODO specify game_id somehow
        return new Promise((resolve, reject) => {
            if (client == null) {
                reject("client is null");
            }
            try {
                client.database.getDynamicGlobalProperties().then((result) => {
                    console.log("current block head: ", result.head_block_number);
                    resolve(result.head_block_number);
                });
            } catch (err) {
                console.error(err);
                reject("Failed to find block head");
            }
        });
    }

    /**
 * Checks if a game has recently been requested with the same data
 */
    async findWaitingPlayers(gameData) {
        if (DISABLE_BLOCKCHAIN) return;

        var headBlockNumber = await this.findBlockHead(client);
        this.processor = steemState(client, dsteem, Math.max(0, headBlockNumber - 100), 1, GAME_ID, 'latest');
        try {
            this.processor.on(POST_GAME_TAG, (data) => {
                console.log("Game block found", data);
                if (this.matchableGames(gameData, data)) {
                    this.gameRequestBlocks.push(data);
                }
            });
            this.processor.on(CLOSE_REQUEST_TAG, (data) => {
                console.log("Close request found", data);
                if (this.matchableGames(gameData, data)) {
                    this.closeRequestBlocks.push(data);
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
     * Determines whether to send a join request to an existing posted game, 
     * or to create a new post game request
     */
    checkWaitingPlayers() {
        if (DISABLE_BLOCKCHAIN) return;

        console.log("finding the best game to connect to");
        if (this.processor !== null) {
            this.processor.stop();
        }
        if (this.gameRequestBlocks.length > 0) {
            var waitingPlayers = [];
            //Finds the most recent game request from each player, which was created
            //less than 5 minutes ago
            for (var i = this.gameRequestBlocks.length - 1; i >= 0; --i) {
                //TODO check that the user is not the same as the current person once testing is complete
                var currentBlock = this.gameRequestBlocks[i];
                if (!waitingPlayers.includes(currentBlock.username) &&
                    (Date.now() - currentBlock.time) < maxWaitingTime) {
                    waitingPlayers.push(currentBlock);
                }
            }
            //Removes games where the player already connected to someone else
            for (var i = this.closeRequestBlocks.length - 1; i >= 0; --i) {
                var currentBlock = this.closeRequestBlocks[i];
                var playerIndex = waitingPlayers.indexOf(currentBlock.username);
                if (playerIndex >= 0) {
                    var possibleClosedGame = waitingPlayers[playerIndex];
                    if (currentBlock.time === possibleClosedGame.time) {
                        waitingPlayers.splice(playerIndex, 1);
                    }
                }
            }
            if (waitingPlayers.length > 0) {
                return waitingPlayers[0];
            }
        }
    }

    /**
     * Checks if two games are compatable
     * @param {*} first
     * @param {*} second
     */
    matchableGames(first, second) {
        if (first.typeID !== second.typeID)
            return false;
        return first.startingColor === "Random" || first.startingColor !== second.startingColor;
    }

    /**
     * Requests to start RTC with a user
     * @param {string} username The opponent's username
     */
    async sendGameRequest(opponentData) {
        return new Promise((resolve, reject) => {
            if (DISABLE_BLOCKCHAIN) resolve();

            console.log("sending request to existing game");
            this.gameData.startingColor = this.decideRandom(this.gameData, opponentData);
            this.transactor.json(this.username, this.posting_key.toString(), JOIN_TAG, {
                data: this.gameData,
                sendingTo: opponentData.username
            }, (err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);
                    alert("Failed to send game request");
                }
                else if (result) {
                    console.log("sent request to existing game", this.gameData);
                    this.initializePeer(false);
                    resolve();
                }
            });
        });
    }

    /**
     * Decides on random starting color for gameData
     */
    decideRandom(thisGame, thatGame) {
        if (thisGame.startingColor === "Random") {
            if (thatGame.startingColor === "Black") {
                return "White";
            }
            else if (thatGame.startingColor === "White") {
                return "Black";
            }
            else {
                return Math.random() < 0.5 ? "White" : "Black";
            }
        }
        return thisGame.startingColor;
    }

    /**
     * Puts game request onto the blockchain
     */
    async postGameRequest() {
        return new Promise((resolve, reject) => {
            if (DISABLE_BLOCKCHAIN) resolve();

            console.log("posting a new game request");
            this.transactor.json(this.username, this.posting_key.toString(), POST_GAME_TAG, this.gameData,
                (err, result) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                        alert("Failed to request game");
                    }
                    else if (result) {
                        console.log("posted game request", result);
                        this.listenForJoinTag(result.block_num);
                        resolve();
                    }
                });
        });
    }

    /**
     * Opens a stream to listen to join requests
     */
    listenForJoinTag(currentBlockNumber) {//TODO timeout after 5 minutes
        this.processor = steemState(client, dsteem, currentBlockNumber, 100, GAME_ID);
        try {
            this.processor.on(JOIN_TAG, (block, sendingTo) => {
                if (sendingTo === this.username && this.matchableGames(this.gameData, block.data)) {
                    this.gameData.startingColor = this.decideRandom(block.data);
                    this.initializePeer(true);
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

    /**
     * Creates a new peer
     * @param {bool} initializingConnection True if this peer is creating the offer
     * the offer
     */
    async initializePeer(initializingConnection) {
        if (DISABLE_BLOCKCHAIN) return;

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

        this.peer.on('connect', () => {
            if (initializingConnection === true) {
                this.transactor.json(this.username, this.posting_key.toString(), CLOSE_REQUEST_TAG, this.gameData, (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            }
            this.props.history.push({
                pathname: '/Live',
                gameData: this.gameData,
                peer: this.peer,
            });
            console.log('Connected to peer!!!');
        });

        var headerBlockNumber = await this.findBlockHead(client);
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
        if (DISABLE_BLOCKCHAIN) return;

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

    createGameClicked() {
        this.gameData = this.createGameComponent.current.grabGameData();

        if (DISABLE_BLOCKCHAIN) {
            this.props.history.push({
                pathname: '/Live',
                gameData: this.gameData,
            });
            return;
        }

        PubSub.publish('spinner', { spin: true });

        this.findWaitingPlayers(this.gameData);
        //If opponent not found after 15 seconds, post a game request
        setTimeout(() => {
            var opponentData = this.checkWaitingPlayers();
            if (opponentData == null) {
                this.postGameRequest();
            }
            else {
                this.sendGameRequest(opponentData);
            }
        }, 15000);
    }

    joinGameClicked() {
        var opponentData = this.joinGameComponent.current.state.selectedData;
        if (opponentData == null) {
            console.error("Opponent data null");
            return;
        }
        this.gameData = opponentData;
        this.gameData.startingColor = "Random";
        this.gameData.username = this.username;

        if (DISABLE_BLOCKCHAIN) {
            this.props.history.push({
                pathname: '/Live',
                gameData: this.gameData,
            });
            return;
        }

        PubSub.publish('spinner', { spin: true });

        this.sendGameRequest(opponentData);
    }

    render() {
        return (
            <div className="horizontal">
                <CreateGameBox ref={this.createGameComponent}
                    onCreateGameClicked={this.createGameClicked}
                    className="box" />
                <JoinGameBox ref={this.joinGameComponent}
                    onJoinGameClicked={this.joinGameClicked}
                    findBlockHead={this.findBlockHead}
                    className="box" />
            </div>
        )
    }

}

export default Play;