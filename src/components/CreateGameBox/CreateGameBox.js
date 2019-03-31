import React, {Component} from 'react';
import './CreateGameBox.css';
import RadioButtonList from "../Radio Button/RadioButtonList";
import Slider from '../Slider/Slider'
import BlackPiece from "../Create Game/Images/rook-black.png";
import MixedPiece from "../Create Game/Images/rook-mixed.png";
import WhitePiece from "../Create Game/Images/rook-white.png";
import { Link } from 'react-router-dom';


class CreateGameBox extends Component{
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
    }

    pieceChanged(tag) {
        console.log(tag);
        this.setState({pieceChosen: tag});
        this.setState({startingColorText: "Starting Color: " + tag});
    }

    timePerSideChanged(value) {
        console.log(value);
        this.setState({timePerSide: value});
    }

    incrementChanged(value) {
        console.log(value);
        this.setState({increment: value});
    }

    timeControlChosen(value) {
        console.log(value);
        this.setState({timeControlChosen: value});
    }

    render() {
        return (
            <div className={CreateGameBox}>
                <Title title={'Create Game'}/>
                <RadioButtonList defaultValue={this.state.timeControlChosen}
                                 options={this.state.timeControlOptions}
                                 onTimeControlChosen={this.timeControlChosen}/>
                <hr noshade="true"/>
                <h3>Time Per Side</h3>
                <Slider min="1"
                        max="10"
                        value={this.state.timePerSide}
                        step="0.5"
                        unit="Minutes"
                        onValueChanged={this.timePerSideChanged}/>
                <h3>Increment</h3>
                <Slider min="1"
                        max="10"
                        value={this.state.increment}
                        step="1"
                        unit="Seconds"
                        onValueChanged={this.incrementChanged}/>
                <hr noshade="true"/>
                <h3>{this.state.startingColorText}</h3>
                <PieceList onPieceChanged={this.pieceChanged}/>
                <Link to="/Live"><button>Create Game</button></Link>
            </div>
        );
    }
}
export default CreateGameBox;


function Title(props){
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
        this.setState({pieceChosen: e.target.id});
        this.props.onPieceChanged(e.target.id);
    };

    render() {
        var pieces = this.state.colorChoices.map(([file, tag], index) =>
            <img key={index}
                 id={tag}
                 onClick={e => this.pieceClicked(e)}
                 className={tag === this.state.pieceChosen ? "selectedPiece" : "chessPiece"}
                 src={file}
                 alt={tag}/>
        )
        return (
            <span>
                {pieces}
            </span>
        );
    }
}