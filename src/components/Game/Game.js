import React, {Component} from 'react';
import './Game.css'
import LiveMatch from '../LiveMatch/LiveMatch';
import CreateGame from '../Create Game/CreateGame';

/**
 * Main game component. Displays either the creating/joining page,
 * or the actual playing page
 */
class Game extends Component {
    constructor(props) {
        super(props)
        this.state = {
            gameStarted: false,
            isInitiating: true,
            gameData: null
        }

        this.switchToLive = this.switchToLive.bind(this);
    }

    /**
     * Switches to LiveMatch
     * @param {boolean} initiating True if starting a new game;
     * false if a game request was found on the blockchain
     */
    switchToLive(gameData, initiating) {
        this.setState({gameData: gameData});
        this.setState({isInitiating: initiating});
        this.setState({gameStarted: true});
    }

    render() {
        var visibleComponent = this.state.gameStarted ?
            <LiveMatch gameData={this.state.gameData}
                       isInitiating={this.state.isInitiating}/> :
            <CreateGame switchToLive={(g, i) => this.switchToLive(g, i)}/>
        return (
            <div>
                {visibleComponent}
            </div>
        );
    }
}

export default Game;