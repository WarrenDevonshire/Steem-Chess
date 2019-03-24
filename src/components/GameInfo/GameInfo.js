import React, {Component} from 'react';
import LiveMatch from '../LiveMatch/LiveMatch';

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
                <h4>{this.state.gameType}</h4>
                <h4>{this.state.gameTime} - {this.state.increment}</h4>  
                <h4>{this.state.ranked}</h4>
                <h4>{this.state.black}</h4>
                <h4>{this.state.white}</h4>
            </div>
        );
    }
}


export default GameInfo;