import React, {Component} from 'react';
import './Play.css';
import JoinGameBox from '../JoinGameBox/JoinGameBox';
import CreateGameBox from "../CreateGameBox/CreateGameBox";

class Play extends Component{
    constructor(props) {
        super(props);

        this.findBlockHead = this.findBlockHead.bind(this);

        console.log(`Play Component Token: ${JSON.stringify(this.props.getAccessToken())}`);
    }

    /**
     * Finds the most recent block number
     * @param {*} client The dsteem client
     */
    async findBlockHead(client) { //TODO specify id
        console.log("starting findBlockHead");
        if(client == null)
        {
            return Promise.reject("client is null");
        }
        try{
            client.database.getDynamicGlobalProperties().then(function (result) {
                return result.head_block_number;
            });
        } catch(err) {
            console.error(err);
            return Promise.reject("Failed to find block head");
        }
    }

    render() {
        return(
            <div className={Play}>
                <CreateGameBox findBlockHead={this.findBlockHead}/>
                <JoinGameBox findBlockHead={this.findBlockHead}/>
            </div>
        )
    }

}

export default Play;