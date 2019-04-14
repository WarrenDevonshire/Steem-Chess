import React, { Component } from 'react';
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
const POST_GAME_TAG = 'post-game'
const CLOSE_REQUEST_TAG = 'request-closed';

class JoinGameBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filterOptions: ["Most Recent", "Least Recent"],
            filterValue: "",
            selectedUser: "",//TODO
            availableGames: [],
            selected: null,
            selectedData: null
        };

        this.filterChanged = this.filterChanged.bind(this);
        this.joinViewChanged = this.joinViewChanged.bind(this);
        this.getFormattedTime = this.getFormattedTime.bind(this);
        this.processor = null;
    }

    componentDidMount() {
        this.findGameRequests();
    }

    componentWillUnmount() {
        if (this.processor != null) {
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
        var waitingOpponents = [];
        var maxWaitingTime = 1000 * 60 * 5;//5 minutes
        var headBlockNumber = await this.props.findBlockHead(client);
        this.processor = steemState(client, dsteem, Math.max(0, headBlockNumber - 150), 0, GAME_ID, 'latest');
        this.processor.on(POST_GAME_TAG, (data) => {
            //If the request was made less than 5 minutes ago
            if ((Date.now() - data.time) < maxWaitingTime) {
                var gameIndex = waitingOpponents.indexOf(data.username);
                //Opponent has a newer game
                if (gameIndex >= 0) {
                    var games = [...this.state.availableGames];
                    games[gameIndex] = data;
                    this.setState({ availableGames:games });
                }
                else {
                    waitingOpponents.push(data.username);
                    this.setState(prevState => ({
                        availableGames: [...prevState.availableGames, data]
                    }))
                }
            }
        });
        this.processor.on(CLOSE_REQUEST_TAG, (data) => {
            var gameIndex = waitingOpponents.indexOf(data.username);
            if(gameIndex >= 0) {
                waitingOpponents.splice(gameIndex, 1);
                var games = [...this.state.availableGames];
                games.splice(gameIndex, 1);
                this.setState({ availableGames:games });
            }
        });
        this.processor.start();
    }

    filterChanged(value) {
        console.log(value);
        this.setState({ filterValue: value });
    }

    //TODO
    joinViewChanged(e) {
        console.log(e);
    }

    getFormattedTime(time) {
        console.log(time);
        var date = new Date(time);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        // Will display time in hh:mm:ss format
        return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    }

    getTimePerSide(typeID) {
        var options = typeID.split("|");
        return options.length > 2 ? options[1] : "";
    }

    getTimeControlChosen(typeID) {
        var options = typeID.split("|");
        return options.length > 1 ? options[0] : "";
    }

    render() {
        return (
            <div className={JoinGameBox} class='JoinGameBox'>
                <div id='horizontal'>
                    <label class="filter">Filter</label>
                    <ComboBox class='ComboBox' options={this.state.filterOptions}
                        onSelectedChanged={this.filterChanged} />
                    <ToggleSwitch checked={false}
                        falseText="Grid"
                        trueText="Card"
                        offColor="#0000ff"
                        onChange={this.joinViewChanged}
                    />
                </div>
                <hr noshade="true" class='Line' />
                <div id='table'>
                    <ReactTable
                        data={this.state.availableGames}
                        columns={[{
                            Header: "Name",
                            id: "name",
                            accessor: 'username'
                        },
                        {
                            Header: "Type",
                            id: "type",
                            accessor: data => this.getTimeControlChosen(data.typeID)
                        },
                        {
                            Header: "Time",
                            id: "time",
                            accessor: data => this.getTimePerSide(data.typeID)
                        },
                        {
                            Header: "Posted",
                            id: "posted",
                            accessor: data => this.getFormattedTime(data.time)
                        }]}
                        getTrProps={(state, rowInfo) => {
                            if (rowInfo && rowInfo.row) {
                                return {
                                    onClick: (e) => {
                                        this.setState({
                                            selected: rowInfo.index,
                                            selectedData: rowInfo.original
                                        })
                                    },
                                    style: {
                                        background: rowInfo.index === this.state.selected ? '#4CAF50' : 'white',
                                        color: rowInfo.index === this.state.selected ? 'white' : 'black'
                                    }
                                }
                            } else {
                                return {}
                            }
                        }}
                        showPagination={false}
                        noDataText='No games found'
                        className="table"
                        resizable={false} />
                </div>
                <hr noshade="true" class='Line' />
                <Link to={{pathname: "/Live", opponentData: this.state.selectedData, findBlockHead: this.props.findBlockHead }} class='link'><button class='Button'>Join Game</button></Link>
            </div>
        );
    }
}

export default JoinGameBox;