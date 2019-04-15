import React, {Component} from 'react';
import './Play.css';
import JoinGameBox from '../JoinGameBox/JoinGameBox';
import CreateGameBox from "../CreateGameBox/CreateGameBox";
import { loadState } from "../../components/localStorage";

class Play extends Component {
    constructor(props) {
        super(props);

        this.findBlockHead = this.findBlockHead.bind(this);
    }

    componentDidMount() {
        var localDB = loadState();
        if(localDB.account == null) {
            this.props.history.push("/Login");
            return;
        }
    }

    /**
     * Finds the most recent block number
     * @param {*} client The dsteem client
     */
    async findBlockHead(client) { //TODO specify game_id somehow
        return new Promise((resolve, reject) => {
            if(client == null)
            {
                reject("client is null");
            }
            try{
                client.database.getDynamicGlobalProperties().then((result) => {
                    console.log("current block head: ", result.head_block_number);
                    resolve(result.head_block_number);
                });
            } catch(err) {
                console.error(err);
                reject("Failed to find block head");
            }
        });
    }

    render() {
        return (
            <div className="horizontal">
                <CreateGameBox findBlockHead={this.findBlockHead} className="box"/>
                <JoinGameBox findBlockHead={this.findBlockHead} className="box"/>
            </div>
        )
    }

}

export default Play;