import React, { Component } from 'react';
import './CreateGameBox.css';
//import RadioButtonList from "../Radio Button/RadioButtonList";
import Slider from '../../shared/components/utils/Slider/Slider'
import BlackPiece from "../CreateGameBox/Images/rook-black.png";
import MixedPiece from "../CreateGameBox/Images/rook-mixed.png";
import WhitePiece from "../CreateGameBox/Images/rook-white.png";

class CreateGameBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeControlOptions: ["Real Time", "Correspondence"],
            timeControlChosen: "Real Time",
            pieceChosen: "Random",
            startingColorText: "Starting Color: Random",
            timePerSide: 5,
            increment: 5,
        };

        this.pieceChanged = this.pieceChanged.bind(this);
        this.timePerSideChanged = this.timePerSideChanged.bind(this);
        this.incrementChanged = this.incrementChanged.bind(this);
        this.timeControlChosen = this.timeControlChosen.bind(this);
        this.grabGameData = this.grabGameData.bind(this);
        this.createClicked = this.createClicked.bind(this);
    }

    pieceChanged(tag) {
        this.setState({ pieceChosen: tag });
        this.setState({ startingColorText: "Starting Color: " + tag });
    }

    timePerSideChanged(value) {
        this.setState({ timePerSide: value });
    }

    incrementChanged(value) {
        this.setState({ increment: value });
    }

    timeControlChosen(value) {
        this.setState({ timeControlChosen: value });
    }

    grabGameData() {
        return {
            startingColor: this.state.pieceChosen,
            username: null,
            time: Date.now(),
            typeID: this.state.timeControlChosen + "|" + this.state.timePerSide + "|" + this.state.increment
        }
    }

    createClicked() {
        this.props.onCreateGameClicked();
    }

    render() {
        return (
            <div className='CreateGameBox'>
                <h1>Create Game</h1>
                <div className='Box'>
                    <hr noshade="true" className='Line' />
                    <h3 className='Line'>Time Per Side</h3>
                    <Slider min="1"
                        max="10"
                        value={this.state.timePerSide}
                        step="0.5"
                        unit="Minutes"
                        onValueChanged={this.timePerSideChanged} />
                    <h3 className='Line'>Increment</h3>
                    <Slider min="1"
                        max="10"
                        value={this.state.increment}
                        step="1"
                        unit="Seconds"
                        onValueChanged={this.incrementChanged} />
                    <hr noshade="true" className='Line' />
                    <h3 className='Line'>{this.state.startingColorText}</h3>
                    <PieceList pieceChosen={this.state.pieceChosen} onPieceChanged={this.pieceChanged} />
                    <button className="Button" onClick={this.createClicked}>Create Game</button>
                </div>
            </div>
        );
    }
}

export default CreateGameBox;


function Title(props) {
    return <h1 className="createTitle">{props.title}</h1>
}

Title.defaultProps = {
    title: "Title"
};

class PieceList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pieceChosen: this.props.pieceChosen ? this.props.pieceChosen : "",
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
            <span className="pieceListSpan">
                {pieces}
            </span>
        );
    }
}