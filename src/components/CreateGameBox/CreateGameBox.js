import React, { Component } from 'react';
import './CreateGameBox.css';
import RadioButtonList from "../Radio Button/RadioButtonList";
import Slider from '../Slider/Slider'
import BlackPiece from "../CreateGameBox/Images/rook-black.png";
import MixedPiece from "../CreateGameBox/Images/rook-mixed.png";
import WhitePiece from "../CreateGameBox/Images/rook-white.png";
import { Link } from 'react-router-dom';
import { Client } from 'dsteem';

//TEMP unitl local data storage
const dsteem = require('dsteem');
const steemState = require('steem-state');
const steemTransact = require('steem-transact');
const client = new Client('https://api.steemit.com');
const USERNAME = "mdhalloran"
const POSTING_KEY = dsteem.PrivateKey.fromLogin(USERNAME, "P5KEH4V4eKrK2WWxnSGw7UQGSD2waYSps3xtpf9ajegc46PGRUzN", 'posting')

class CreateGameBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeControlOptions: ["Real Time", "Correspondence"],
            timeControlChosen: "Real Time",
            pieceChosen: "",
            startingColorText: "Starting Color",
            timePerSide: 5,
            increment: 5,
        };

        this.pieceChanged = this.pieceChanged.bind(this);
        this.timePerSideChanged = this.timePerSideChanged.bind(this);
        this.incrementChanged = this.incrementChanged.bind(this);
        this.timeControlChosen = this.timeControlChosen.bind(this);
        this.grabGameData = this.grabGameData.bind(this);
        this.findWaitingPlayer = this.findWaitingPlayer.bind(this);
    }

    pieceChanged(tag) {
        console.log(tag);
        this.setState({ pieceChosen: tag });
        this.setState({ startingColorText: "Starting Color: " + tag });
    }

    timePerSideChanged(value) {
        console.log(value);
        this.setState({ timePerSide: value });
    }

    incrementChanged(value) {
        console.log(value);
        this.setState({ increment: value });
    }

    timeControlChosen(value) {
        console.log(value);
        this.setState({ timeControlChosen: value });
    }

    grabGameData() {
        console.log("Trying to grab game data");
        return {
            timeControlChosen: this.state.timeControlChosen,
            timePerSide: this.state.timePerSide,
            increment: this.state.increment,
            startingColor: this.state.pieceChosen,
            userId: USERNAME + Date.now()
        }
    }

    /**
     * Checks if a game has recently been requested with the same data
     * @param {*} gameData 
     */
    async findWaitingPlayer(gameData) {//TODO won't filter out players that have already joined a game
        console.log("starting findWaitingPlayer");
        var headBlockNumber = await this.props.findBlockHead(client);
        var processor = steemState(client, dsteem, Math.max(0, headBlockNumber - 1000), 100, 'steem-chess');
        try {
            processor.on('request-open', function (json, from) {
                if (this.matchableGames(gameData, json.data)) {
                    return from;
                }
                else {
                    console.error("Opponent tried to connect with incorrect game data", json.data, gameData);
                }
            });
            processor.start();
        } catch (err) {
            console.error(err)
            processor.stop();
        }
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

    render() {
        return (
            <div className={CreateGameBox}>
                <Title title={'Create Game'} />
                <RadioButtonList defaultValue={this.state.timeControlChosen}
                    options={this.state.timeControlOptions}
                    onTimeControlChosen={this.timeControlChosen} />
                <hr noshade="true" />
                <h3>Time Per Side</h3>
                <Slider min="1"
                    max="10"
                    value={this.state.timePerSide}
                    step="0.5"
                    unit="Minutes"
                    onValueChanged={this.timePerSideChanged} />
                <h3>Increment</h3>
                <Slider min="1"
                    max="10"
                    value={this.state.increment}
                    step="1"
                    unit="Seconds"
                    onValueChanged={this.incrementChanged} />
                <hr noshade="true" />
                <h3>{this.state.startingColorText}</h3>
                <PieceList onPieceChanged={this.pieceChanged} />
                <Link to={{ pathname: "/Live", gameData: this.grabGameData(), waitingPlayer: this.findWaitingPlayer }}><button>Create Game</button></Link>
            </div>
        );
    }
}
export default CreateGameBox;


function Title(props) {
    return <h1>{props.title}</h1>
}
Title.defaultProps = {
    title: "Title"
};

class PieceList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pieceChosen: "",
            colorChoices: [[BlackPiece, "Black"], [MixedPiece, "Random"], [WhitePiece, "White"]]
        }
    }

    pieceClicked(e) {
        this.setState({ pieceChosen: e.target.id });
        this.props.onPieceChanged(e.target.id);
    };

    render() {
        var pieces = this.state.colorChoices.map(([file, tag], index) =>
            <img key={index}
                id={tag}
                onClick={e => this.pieceClicked(e)}
                className={tag === this.state.pieceChosen ? "selectedPiece" : "chessPiece"}
                src={file}
                alt={tag} />
        )
        return (
            <span>
                {pieces}
            </span>
        );
    }
}