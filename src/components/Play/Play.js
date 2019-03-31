import React, {Component} from 'react';
import './Play.css';
import JoinGameBox from '../JoinGameBox/JoinGameBox';
import CreateGameBox from "../CreateGameBox/CreateGameBox";

class Play extends Component {
    constructor(props) {
        super(props);

        console.log(`Play Component Token: ${JSON.stringify(this.props.getAccessToken())}`);
    }

    render() {
        return (
            <div className={Play}>
                <CreateGameBox/>
                <JoinGameBox/>
            </div>
        )
    }

}

export default Play;