import React, {Component} from 'react';
import './CreateGame.css'
import Slider from '../Slider/Slider'
import WhitePiece from './Images/rook-white.png';
import MixedPiece from './Images/rook-mixed.png';
import BlackPiece from './Images/rook-black.png';

class CreateGame extends Component{
    render(){
        return (
            <div className="CreateGame">
                <h1>Create Game</h1>
                <h1>Join Game</h1>
                <div className="mainDiv">
                    <div className="leftBox box">
                        <h3>Time Per Side</h3>
                        <h3>Increment</h3>
                            <Slider/>
                        <h3>Starting Color</h3>
                        <ul className="horizontal">
                            <li>
                            <img className="img1" 
                        src={BlackPiece}
                        alt="Black"/>
                            </li>
                            <li>
                            <img className="img1" 
                        src={MixedPiece}
                        alt="Random"/>
                            </li>
                            <li>
                            <img className="img1" 
                        src={WhitePiece}
                        alt="White"/>
                            </li>
                        </ul>
                        <button>Start</button>
                    </div>
                    <div className="box">
                        
                        <button>Join</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateGame;