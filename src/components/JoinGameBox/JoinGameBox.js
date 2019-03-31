import React, {Component} from 'react';
import './JoinGameBox.css';
import ComboBox from '../Combo Box/ComboBox'
import ToggleSwitch from '../Toggle Switch/ToggleSwitch';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Link } from 'react-router-dom';
import { loadState } from "../../components/localStorage";
import LiveMatch from '../LiveMatch/LiveMatch'

//TEMP unitl local data storage
const GAME_ID = 'steem-chess'
const dsteem = require('dsteem');
const steemState = require('steem-state');
const client = new dsteem.Client('https://api.steemit.com');

class JoinGameBox extends Component {
    constructor(props) {
        super(props);

        var localDB = loadState();

        this.state = {
            filterOptions: ["Most Recent", "Least Recent"],
            filterValue: "",
            selectedUser: "",//TODO
            username: localDB.account
        };


        this.filterChanged = this.filterChanged.bind(this);
        this.joinViewChanged = this.joinViewChanged.bind(this);
        this.grabGameData = this.grabGameData.bind(this);
    }

    /**
     * Finds all game requests that haven't been satisfied
     * @param {*} gameData 
     */
    async findAllGameRequests()//TODO stop processor eventually
    {
        return;
        var openRequests = new Map();
        var closedRequests = new Map();
        var headBlockNumber = await this.props.findBlockHead(this.client);
        var processor = steemState(client, dsteem, Math.max(0, headBlockNumber - 1000), 100, GAME_ID);
        processor.on('request-open', function (json, from) {
            openRequests.set(json.userId, [from, json]);
        });
        processor.on('request-closed', function (json, from) {
            closedRequests.set(json.userId, [from, json]);
        });
        processor.start();
        closedRequests.forEach((key) => {
            openRequests.delete(key);
        })
        return openRequests;
    }

    filterChanged(value) {
        console.log(value);
        this.setState({filterValue: value});
    }

    //TODO
    joinViewChanged(e) {
        console.log(e);
    }

    //TODO
    grabJoinData() {

    }

    //TODO
    grabGameData() {
        return {
            timeControlChosen: "",
            timePerSide: "",
            increment: "",
            startingColor: "",
            userId: this.state.username + Date.now(),
            typeID: "" + "|" + "" + "|" + ""
        }
    }

    render() {
        return (
            <div className={JoinGameBox}>
                <div className="horizontal">
                    <label>Filter</label>
                    <ComboBox options={this.state.filterOptions}
                              onSelectedChanged={this.filterChanged}/>
                    <ToggleSwitch checked={false}
                                  falseText="Grid"
                                  trueText="Card"
                                  offColor="#0000ff"
                                  onChange={this.joinViewChanged}/>
                </div>
                <hr noshade="true"/>
                <ReactTable
                    data={this.grabJoinData()}
                    columns={[{
                        Header: "Name",
                        accessor: 'name'
                    },
                        {
                            Header: "Type",
                            accessor: 'type'
                        },
                        {
                            Header: "Time",
                            accessor: 'time'
                        },
                        {
                            Header: "Posted",
                            accessor: 'posted'
                        }]}
                    showPagination={false}
                    className="table"
                    resizable={false}/>
                <hr noshade="true"/>
                <Link to="/Live" params={{gameData: this.grabGameData, waitingPlayer: this.state.selectedUser}}><button>Join Game</button></Link>
            </div>
        );
    }
}

export default JoinGameBox;