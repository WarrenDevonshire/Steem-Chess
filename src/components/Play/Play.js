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
        return new Promise((resolve, reject) => {
            if(client == null)
            {
                return reject("client is null");
            }
            try{
                client.database.getDynamicGlobalProperties().then(function (result) {
                    console.log("findblockheadresult: ", result.head_block_number);
                    resolve(result.head_block_number);
                });
            } catch(err) {
                console.error(err);
                return reject("Failed to find block head");
            }
        });
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