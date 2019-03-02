import React, {Component} from 'react';
import ReactDOM from 'react-dom';
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
          mode: 0,
          timePerSide: 10,
          increment:  10
        }
        this.pieceChanged = this.pieceChanged.bind(this);
        //this.addOne = this.addOne.bind(this)
      }
      
    //   addOne() {
    //     this.setState({
    //       counter: this.state.counter + 1
    //     })
    //   }
    pieceChanged(index) {
        console.log(index);
        //this.state.pieceChosen = index;
        //console.log(this.state.pieceChosen);
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
                        <Slider/>
                        <h3>Increment</h3>
                        <Slider/>
                        <hr noshade/>
                        <h3>Starting Color</h3>
                        <PieceList indexClicked={this.state.pieceChosen}
                                    onIndexChanged={this.pieceChanged}/>
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
        const colorChoices = [[0, BlackPiece, "Black"], [1, MixedPiece, "Random"], [2, WhitePiece, "White"]];
        this.state = {
            indexChosen: -1,
            pieces: colorChoices.map(([index, file, tag]) =>
            <img key={index}
            id={index}
            onClick={e => this.pieceClicked(e)}
            className="chessPiece"
            src={file} 
            alt={tag} />
            )
        }
    }

    pieceClicked(e) {
        if(this.state.indexChosen == -1 || this.state.indexChosen != e.target.id)
        {
            this.state.indexChosen = e.target.id;
            for(var i = 0; i < this.state.pieces.length; i++) {
                if(i == e.target.id) {
                    e.target.className = "selectedPiece";
                    console.log("a" + i)
                }
                else {
                    e.target.className = "chessPiece";
                    console.log("b" + i)
                }
            }
        }
        else
        {
            this.state.indexChosen = -1;
            for(var i = 0; i < this.state.pieces.length; i++) {
                e.target.className = "chessPiece";
                console.log("d" + i)
            }
        }
        this.props.onIndexChanged(this.state.indexChosen);
    };

    render() {
        return (
            <span>
                {this.state.pieces}
            </span>
        );
    }
}

// ReactDOM.render(
//     <PieceList />,
//     document.getElementById('root'))

export default CreateGame;