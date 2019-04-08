import React, {Component} from 'react';
import './JoinGameBox.css';
import ComboBox from '../Combo Box/ComboBox'
import ToggleSwitch from '../Toggle Switch/ToggleSwitch';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Link } from 'react-router-dom';
//import LiveMatch from '../LiveMatch/LiveMatch'

const GAME_ID = 'steem-chess'
const dsteem = require('dsteem');
const steemState = require('steem-state');
const client = new dsteem.Client('https://api.steemit.com');
const USERNAME = "mdhalloran"
const POST_GAME_TAG = 'post-game'
const CLOSE_REQUEST_TAG = 'request-closed';

class JoinGameBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filterOptions: ["Most Recent", "Least Recent"],
            filterValue: "",
            selectedUser: "",//TODO
            availableGames: []
        };


        this.filterChanged = this.filterChanged.bind(this);
        this.joinViewChanged = this.joinViewChanged.bind(this);
        this.grabGameData = this.grabGameData.bind(this);
        this.processor = null;
    }

    componentDidMount() {
        this.findGameRequests();
    }

    componentWillUnmount() {
        if(this.processor != null) {
            this.processor.stop();
        }
    }

    /**
     * Finds all game requests that haven't been satisfied
     * @param {*} gameData 
     */
    async findGameRequests()//TODO stop processor eventually and check if games were finished
    {
        console.log("Trying to find game requests");
        var openRequests = new Map();
        var closedRequests = new Map();
        var headBlockNumber = await this.props.findBlockHead(client);
        this.processor = steemState(client, dsteem, Math.max(0, headBlockNumber - 150), 1, GAME_ID, 'latest');
        this.processor.on(POST_GAME_TAG, (json, from) => {
            console.log("Found a join game block!!!", json, from);
            openRequests.set(from, json);
            this.setState(prevState => ({
                availableGames: [...prevState.availableGames, json.data]
              }))
        });
        this.processor.on(CLOSE_REQUEST_TAG, function (json, from) {
            closedRequests.set(from, json);
        });
        this.processor.start();
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
    grabGameData() {
        return {
            timeControlChosen: "",
            timePerSide: "",
            increment: "",
            startingColor: "",
            user: USERNAME,
            time: Date.now(),
            typeID: " | | "
        }
    }

    render() {
        return(
            <div className={JoinGameBox} class='JoinGameBox'>
                <div id='horizontal'>
                    <label class="filter">Filter</label>
                    <ComboBox class='ComboBox' options={this.state.filterOptions}
                              onSelectedChanged={this.filterChanged}/>
                    <ToggleSwitch checked={false}
                                  falseText="Grid"
                                  trueText="Card"
                                  offColor="#0000ff"
                                  onChange={this.joinViewChanged}
                    />
                </div>
                <hr noshade="true" class='Line'/>
                <div id='table'>
                <ReactTable
                    data={this.state.availableGames}
                    columns={[{
                        Header: "Name",
                        accessor: 'user'
                    },
                        {
                            Header: "Type",
                            accessor: 'timeControlChosen'
                        },
                        {
                            Header: "Time",
                            accessor: 'timePerSide'
                        },
                        {
                            Header: "Posted",
                            accessor: 'time'
                        }]}
                    showPagination={false}
                    className="table"
                    resizable={false}/>
                    </div>
                <hr noshade="true" class='Line'/>
                <Link to="/Live" params={{gameData: this.grabGameData, waitingPlayer: this.state.selectedUser}} class='link'><button class='Button'>Join Game</button></Link>
            </div>
        );
    }
}

export default JoinGameBox;