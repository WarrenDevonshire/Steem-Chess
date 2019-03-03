import React, {Component} from 'react';
import './CreateGame.css'
import Slider from '../Slider/Slider'
import RadioButtonList from '../Radio Button/RadioButtonList'
import ComboBox from '../Combo Box/ComboBox'
import WhitePiece from './Images/rook-white.png';
import MixedPiece from './Images/rook-mixed.png';
import BlackPiece from './Images/rook-black.png';
import ToggleSwitch from '../Toggle Switch/ToggleSwitch';

class CreateGame extends Component{
    constructor(props) {
        super(props)
        this.state = {
          timeControlOptions: ["Real Time", "Correspondence"],
          timeControlChosen: "Real Time",
          pieceChosen: -1,
          startingColorText: "Starting Color",
          mode: 0,
          timePerSide: 5,
          increment:  5,

          filterOptions: [[0, "Most Recent"],[1, "Least Recent"]],
          filterValue: ""
        }
        this.pieceChanged = this.pieceChanged.bind(this);
        this.timePerSideChanged = this.timePerSideChanged.bind(this);
        this.incrementChanged = this.incrementChanged.bind(this);
        this.timeControlChosen = this.timeControlChosen.bind(this);
        this.filterChanged = this.filterChanged.bind(this);
        this.joinViewChanged = this.joinViewChanged.bind(this);
      }
      
    pieceChanged(index) {
        console.log(index);
        this.setState({pieceChosen:index});
        if(index == 0)
        {
            this.setState({startingColorText:"Starting Color: Black"});
        }
        else if(index == 1)
        {
            this.setState({startingColorText:"Starting Color: Random"});
        }
        else if(index == 2)
        {
            this.setState({startingColorText:"Starting Color: White"});
        }
        else
        {
            this.setState({startingColorText:"Starting Color"});
        }
    }

    timePerSideChanged(value) {
        console.log(value);
        this.setState({timePerSide:value});
    }

    incrementChanged(value) {
        console.log(value);
        this.setState({increment:value});
    }

    timeControlChosen(value) {
        console.log(value);
        this.setState({timeControlChosen:value});
    }

    filterChanged(value) {
        console.log(value);
        this.setState({filterValue:value});
    }

    joinViewChanged(e) {
        console.log(e);
        //TODO change join view type
    }

    render(){
        return (
            <div className="CreateGame">
            <div className="mainDiv">
            <h1 className="half">Create Game</h1>
                <h1 className="half">Join Game</h1>
                </div>
                <div className="mainDiv">
                    <div className="box half">
                    <RadioButtonList defaultValue={this.state.timeControlChosen}
                            options={this.state.timeControlOptions}
                            onTimeControlChosen={this.timeControlChosen}
                            labelPadding="100px"/>
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
                        <button>Start</button>
                    </div>
                    <div className="box half">
                    <div className="horizontal">
                    <label>Filter</label>
                            <ComboBox options={this.state.filterOptions}
                                    onSelectedChanged={this.filterChanged}/>
                            <ToggleSwitch checked="false"
                                falseText="Grid"
                                trueText="asdf"
                                onChange={this.joinViewChanged}/>
                    </div>
                            <hr noshade="true"/>
                            <hr noshade="true"/>
                        <button>Join</button>
                    </div>
                </div>
            </div>
        );
    }
}

class PieceList extends Component{
    constructor(props){
        super(props);
        this.state = {
            indexChosen: -1,
            colorChoices: [[0, BlackPiece, "Black"], [1, MixedPiece, "Random"], [2, WhitePiece, "White"]]
        }
    }

    pieceClicked(e) {
        this.setState({indexChosen:e.target.id});
        this.props.onPieceChanged(e.target.id);
    };

    render() {
        var pieces = this.state.colorChoices.map(([index, file, tag]) =>
            <img key={index}
            id={index}
            onClick={e => this.pieceClicked(e)}
            className={index == this.state.indexChosen ? "selectedPiece" : "chessPiece"}
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

export default CreateGame;