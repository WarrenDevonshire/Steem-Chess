import React, {Component} from 'react';
import './CreateGame.css'
import Slider from '../Slider/Slider'
import RadioButtonList from '../Radio Button/RadioButtonList'
import ComboBox from '../Combo Box/ComboBox'
import WhitePiece from './Images/rook-white.png';
import MixedPiece from './Images/rook-mixed.png';
import BlackPiece from './Images/rook-black.png';
import ToggleSwitch from '../Toggle Switch/ToggleSwitch';
import Steem from 'steem';

class CreateGame extends Component{
    constructor(props) {
        super(props)
        this.state = {
          timeControlOptions: ["Real Time", "Correspondence"],
          timeControlChosen: "Real Time",
          pieceChosen: "",
          startingColorText: "Starting Color",
          mode: 0,
          timePerSide: 5,
          increment:  5,

          filterOptions: ["Most Recent", "Least Recent"],
          filterValue: ""
        }
        this.pieceChanged = this.pieceChanged.bind(this);
        this.timePerSideChanged = this.timePerSideChanged.bind(this);
        this.incrementChanged = this.incrementChanged.bind(this);
        this.timeControlChosen = this.timeControlChosen.bind(this);
        this.filterChanged = this.filterChanged.bind(this);
        this.joinViewChanged = this.joinViewChanged.bind(this);
        this.startGame = this.startGame.bind(this);
      }
      
    pieceChanged(tag) {
        console.log(tag);
        this.setState({pieceChosen:tag});
        this.setState({startingColorText:"Starting Color: "+tag});
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

    startGame(e) {
        console.log(e);
        console.log(Steem.api);
        // Steem.api.broadcastBlock(e, function(err, response){
        // console.log(err, response);
        // });
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
                        <button onClick={e => this.startGame(e)}>Start</button>
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
            pieceChosen: "",
            colorChoices: [[BlackPiece, "Black"], [MixedPiece, "Random"], [WhitePiece, "White"]]
        }
    }

    pieceClicked(e) {
        this.setState({pieceChosen:e.target.id});
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

export default CreateGame;