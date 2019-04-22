import React, {Component} from 'react';
import './GameInfo.css';

class GameInfo extends Component{
    constructor(props) {
        super(props)
        this.state = {
            gameType: this.props.gameType,
            gameTime: this.props.gameTime,
            increment: this.props.increment,
            ranked: this.props.ranked,
            black: this.props.black,
            white: this.props.white
        }
    }
        
    
    render(){
        return(
            <div className="box">
                <div class='Top'>
                    <h4>{this.state.gameType} {this.state.gameTime} - {this.state.increment} {this.state.ranked}</h4>
                </div>
                <div class='Bottom'>
                    <h4>{this.state.black}</h4>
                    <h4>{this.state.white}</h4>
                </div>
            </div>
        );
    }
}


export default GameInfo;