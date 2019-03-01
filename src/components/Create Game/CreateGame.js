import React, {Component} from 'react';
import './CreateGame.css'
import Slider from '../Slider/Slider'
import WhitePiece from './Images/rook-white.png';
import MixedPiece from './Images/rook-mixed.png';
import BlackPiece from './Images/rook-black.png';

class CreateGame extends Component{
    pieceChosen(e) {
        e.preventDefault()
        console.log(e.target)
        var targetObject = e.target;
        if(targetObject.className === "selectedItem")
        {
            targetObject.className = "chessItem";
        }
        else
        {
            targetObject.className = "selectedItem";
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
                        <Slider/>
                        <h3>Increment</h3>
                        <Slider/>
                        <hr noshade/>
                        <h3>Starting Color</h3>
                        <span>
                        <img onClick={e => this.pieceChosen(e)}
                             className="chessItem" 
                        src={BlackPiece}
                        alt="Black"/>
                            <img onClick={e => this.pieceChosen(e)}
                            className="chessItem" 
                        src={MixedPiece}
                        alt="Random"/>
                            <img onClick={e => this.pieceChosen(e)}
                            className="chessItem" 
                        src={WhitePiece}
                        alt="White"/>
                        </span>
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

export default CreateGame;