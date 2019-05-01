import React, { Component } from 'react';
import './JoinGameBox.css';
import '../Play/Play.css';
//import ComboBox from '../Combo Box/ComboBox'
//import ToggleSwitch from '../Toggle Switch/ToggleSwitch';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
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
            filterValue: "",
            availableGames: [],
            selected: null,
            selectedData: null
        };

        this.processor = null;

        this.filterChanged = this.filterChanged.bind(this);
        this.joinViewChanged = this.joinViewChanged.bind(this);
        this.getFormattedTime = this.getFormattedTime.bind(this);
        this.joinClicked = this.joinClicked.bind(this);
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
        var maxWaitingTime = 1000 * 60 * 15;//5 minutes
        var headBlockNumber = await this.props.findBlockHead(client);
        this.processor = steemState(client, dsteem, Math.max(0, headBlockNumber - 350), 0, GAME_ID, 'latest');
        this.processor.on(POST_GAME_TAG, (block) => {
            console.log("found BLOCK", block);
            var data = block.data;
            data.pKey = block.pKey
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

    optionsSplitter(typeID, index) {
        var options = typeID.split("|");
        return options.length > index + 1 ? options[index] : "";
    }

    getTimePerSide(typeID) {
        return this.optionsSplitter(typeID, 1);
    }

    getTimeControlChosen(typeID) {
        return this.optionsSplitter(typeID, 0);
    }

    joinClicked(e) {
        this.props.onJoinGameClicked();
    }

    render() {
        return (
            <div className='playBox'>
                <div>
                    <h1>Join Game</h1>
                </div>
                <div>
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
                        getTrProps={(_, rowInfo) => {
                            if (rowInfo && rowInfo.row) {
                                return {
                                    onClick: () => {
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
                <hr noshade="true" className='Line' />
                <button className="Button" onClick={this.joinClicked}>Join Game</button>
            </div>
        );
    }
}

export default JoinGameBox;