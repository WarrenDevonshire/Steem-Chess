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
                <p>
                    <Slider/>
                </p>
                <Slider/>
                <p>
                    Paragraph Example
                </p>
                <img class="img1" 
                src={BlackPiece}
                alt="Black"/>
                <img class="img1" 
                src={MixedPiece}
                alt="Random"/>
                <img class="img1" 
                src={WhitePiece}
                alt="White"/>
                <button>Start</button>
            </div>
        );
    }
}

export default CreateGame;