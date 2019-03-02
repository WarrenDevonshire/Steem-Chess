import React, {Component} from 'react';
import './CreateGame.css'
import Slider from '../Slider/Slider'
import WhitePiece from './Images/rook-white.png';
import MixedPiece from './Images/rook-mixed.png';
import BlackPiece from './Images/rook-black.png';

class CreateGame extends Component{
    constructor(props) {
        super(props)
        this.state = {
          pieceChosen: -1,
          startingColorText: "Starting Color",
          mode: 0,
          timePerSide: 5,
          increment:  5
        }
        this.pieceChanged = this.pieceChanged.bind(this);
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

    render(){
        return (
            <div className="CreateGame">
            <div className="mainDiv">
            <h1 className="half">Create Game</h1>
                <h1 className="half">Join Game</h1>
                </div>
                <div className="mainDiv">
                    <div className="box half">
                    <hr noshade/>
                        <h3>Time Per Side</h3>
                        <Slider min="1"
                            max="10"
                            value={this.state.timePerSide}
                            unit="Minutes"/>
                        <h3>Increment</h3>
                        <Slider min="1"
                            max="10"
                            value={this.state.increment}
                            unit="Seconds"/>
                        <hr noshade/>
                        <h3>{this.state.startingColorText}</h3>
                        <PieceList onPieceChanged={this.pieceChanged}/>
                        <button>Start</button>
                    </div>
                    <div className="box half">
                        
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