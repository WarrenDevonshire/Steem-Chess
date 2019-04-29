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
        this.optionClicked = false;

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
        clearTimeout(this.failedToJoinTimeout);//TODO not working
        clearTimeout(this.createGameTimeout);//TODO not working
        PubSub.publish('spinner', { spin: false });
    }

    componentDidMount() {
        var localDB = loadState();
        if (localDB.account == null) {
            this.props.history.push("/Login");
            return;
        }
        this.username = localDB.account;
        try {
            this.posting_key = dsteem.PrivateKey.fromString(localDB.key);
        }
        catch (e) {

            console.error(e);

            // check for garbage login, redirect to login if privatekey can't be generated
            // this exception is thrown if password is invalid or is not a posting key, does not check for username/password association
            if (e.message === "private key network id mismatch") {

                alert("Bad password.");
                this.props.history.push('/Login');
                return;

            } else {

                // if any other exception is thrown, redirect to home
                alert("An error occurred when generating key. See console for details.");
                this.props.history.push('/');
                return;

            }

        }
    }

    /**
     * Encrypts a message using a shared key
     * @param {*} key 
     * @param {*} text 
     */
    encrypt(key, text) {
        var shift = this.getStringHashCode(key);
        var charCodes = [];
        text.split("").forEach(char => {
            charCodes.push(char.charCodeAt());
        });
        var shiftedChars = [];
        charCodes.forEach(code => {
            shiftedChars.push(String.fromCharCode(this.mod(code + shift, 70537)));
        });
        var shuffledChars = [];
        for(var i = 0; i < shiftedChars.length; i++) {
            if(i%2 == 0 && i+1 < shiftedChars.length)
                shuffledChars.push(shiftedChars[i+1]);
            else if(i%2 == 1 && i-1 >= 0)
                shuffledChars.push(shiftedChars[i-1]);
            else
                shuffledChars.push(shiftedChars[i]);
        }
        return shuffledChars.join("");
    }

    /**
     * Decrypts a message using a shared key
     * @param {*} key 
     * @param {*} text 
     */
    decrypt(key, text) {
        var shift = this.getStringHashCode(key);
        var encryptedChars = text.split("");
        var unshuffledChars = [];
        for(var i = 0; i < encryptedChars.length; i++) {
            if(i%2 == 0 && i+1 < encryptedChars.length)
                unshuffledChars.push(encryptedChars[i+1]);
            else if(i%2 == 1 && i-1 >= 0)
                unshuffledChars.push(encryptedChars[i-1]);
            else
                unshuffledChars.push(encryptedChars[i]);
        }
        var shiftedCodes = [];
        unshuffledChars.forEach(char => {
            shiftedCodes.push(char.charCodeAt());
        });
        var plainChars = [];
        shiftedCodes.forEach(code => {
            plainChars.push(String.fromCharCode(this.mod(code - shift, 70537)));
        });
        return plainChars.join("");
    }

    /**
     * Calculates a hash code for a string
     * @param {*} text 
     */
    getStringHashCode(text) {
        var hash = 0, i, chr;
        if (text.length === 0) return hash;
        for (i = 0; i < text.length; i++) {
            chr = text.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    /**
     * Performs modulus on a number, ensuring that it is
     * always positive
     * @param {*} number 
     * @param {*} m 
     */
    mod(number, m) {
        return ((number%m)+m)%m;
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
        this.processor = steemState(client, dsteem, Math.max(0, headBlockNumber - 150), 1, GAME_ID, 'latest');
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
                var iBlock = this.gameRequestBlocks[i];
                if (!waitingPlayers.includes(iBlock.username) &&
                    (Date.now() - iBlock.time) < maxWaitingTime) {
                    waitingPlayers.push(iBlock);
                }
            }
            //Removes games where the player already connected to someone else
            for (var j = this.closeRequestBlocks.length - 1; j >= 0; --j) {
                var jBlock = this.closeRequestBlocks[j];
                var playerIndex = waitingPlayers.indexOf(jBlock.username);
                if (playerIndex >= 0) {
                    var possibleClosedGame = waitingPlayers[playerIndex];
                    if (jBlock.time === possibleClosedGame.time) {
                        waitingPlayers.splice(playerIndex, 1);
                    }
                }
            }
            if (waitingPlayers.length > 0) {
                console.log("got eem");
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
            this.gameData.startingColor = this.decideRandom(this.gameData.startingColor, opponentData.startingColor);
            opponentData.startingColor = this.decideRandom(opponentData.startingColor, this.gameData.startingColor);
            this.transactor.json(this.username, this.posting_key.toString(), JOIN_TAG, opponentData,
                (err, result) => {
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
     * Decides on random starting color for thisColor
     */
    decideRandom(thisColor, thatColor) {
        if (thisColor !== "Random") return thisColor.toString();
        if (thatColor === "Black") return "White";
        if (thatColor === "White") return "Black";
        return Math.random() < 0.5 ? "White" : "Black";
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
    listenForJoinTag(currentBlockNumber) {
        this.processor = steemState(client, dsteem, currentBlockNumber, 100, GAME_ID);
        try {
            this.processor.on(JOIN_TAG, (block) => {
                if (this.username === block.username && this.gameData.typeID === block.typeID) {
                    console.log("accepted join block");
                    this.gameData.startingColor = block.startingColor;
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

        this.failedToJoinTimeout = setTimeout(() => {//TODO put timeouts in more places, for different parts of the process
            if (this.peer == null) {
                if (this.processor !== null)
                    this.processor.stop();
                PubSub.publish('spinner', { spin: false });
                alert("Failed to find opponent within 5 minutes");
            }
        }, maxWaitingTime);
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

        this.sharedKey = this.gameData.time + this.gameData.typeID;

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
                var decryptedSignal = JSON.parse(this.decrypt(this.sharedKey, signal.signal));
                this.peer.signal(decryptedSignal);
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
        var encryptedSignal = this.encrypt(this.sharedKey, JSON.stringify(signal));
        this.transactor.json(this.username, this.posting_key.toString(), sendingTag, {
            signal: encryptedSignal,
            from: this.username
        }, (err) => {
            if (err) {
                console.error(err);
                alert("Failed opponent connection process");
            }
        });
    }

    createGameClicked() {
        if (this.optionClicked) return;
        this.optionClicked = true;
        this.gameData = this.createGameComponent.current.grabGameData();
        this.gameData.username = this.username;

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
        this.createGameTimeout = setTimeout(() => {
            var opponentData = this.checkWaitingPlayers();
            console.log("in timeout thingy", this.gameData, opponentData);
            if (opponentData == null) {
                this.postGameRequest();
            }
            else {
                this.sendGameRequest(opponentData);
            }
        }, 15000);
    }

    joinGameClicked() {
        if (this.optionClicked) return;
        this.optionClicked = true;
        var opponentData = this.joinGameComponent.current.state.selectedData;
        if (opponentData == null) {
            console.error("Opponent data null");
            return;
        }

        this.gameData = {
            startingColor: "Random",
            username: this.username,
            time: opponentData.time,
            typeID: opponentData.typeID
        }

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