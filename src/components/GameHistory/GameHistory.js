import React, { Component } from "react";
import "./GameHistory.css";

const pieceToUnicode = {
    "wp": "\u2659",
    "wn": "\u2658",
    "wr": "\u2656",
    "wb": "\u2657",
    "wq": "\u2655",
    "bp": "\u265F",
    "bn": "\u265E",
    "br": "\u265C",
    "bb": "\u265D",
    "bq": "\u265B",
}

class GameHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            whiteMoves: [],
            blackMoves: [],
        }
        this.history = [];
    }

    addMove(move, time) {
        if (move.color === "w") {
            this.setState({ whiteMoves: [...this.state.whiteMoves, [move, time]] });
        }
        else {
            this.setState({ blackMoves: [...this.state.blackMoves, [move, time]] });
        }
    }

    render() {
        var whiteList;
        if (this.state.whiteMoves != null) {
            whiteList = this.state.whiteMoves.map(([move, time], index) =>
                <Move key={index}
                    move={move}
                    time={time} />
            )
        }
        var blackList;
        if (this.state.blackMoves != null) {
            blackList = this.state.blackMoves.map(([move, time], index) =>
                <Move key={index}
                    move={move}
                    time={time} />
            )
        }
        return (
            <div id="history-main-div">
                <section id="history-headers">
                    <div id="history-white-header">White</div>
                    <div id="history-black-header">Black</div>
                </section>
                <div id="history-moves-div">
                <section id="white-history-box">
                    <span>
                        {whiteList}
                    </span>
                </section>
                <section id="black-history-box">
                    <span>
                        {blackList}
                    </span>
                </section>
                </div>
            </div>
        );
    }
}

class Move extends Component {
    constructor(props) {
        super(props);
        this.state = {
            move: this.props.move,
            time: this.props.time,
        }
        console.log("created a move!");
    }

    getFormattedMove() {
        if (this.state.move == null || this.state.move == undefined) return "";
        var returnString = "";
        if(this.state.move.captured !== undefined) {
            var opponentColor = this.state.move.color === "w" ? "b" : "w";
            returnString += pieceToUnicode[opponentColor + this.state.move.captured] + " ";
        }
        return returnString += this.state.move.from + " \u2192 " + this.state.move.to;
    }

    getFormattedTime() {
        var date = new Date(this.state.time);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        // Will display time in hh:mm:ss format
        return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    }

    render() {
        return (
            <div>
                <h4 className="move">{this.getFormattedMove()}</h4>
                <h6 className="time">{this.getFormattedTime()}</h6>
            </div>
        );
    }
}

export default GameHistory;