//DEPRECATED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//DEPRECATED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//DEPRECATED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//DEPRECATED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//DEPRECATED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//DEPRECATED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//DEPRECATED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
import React, {Component} from 'react';
import './CreateGame.css'
import Slider from '../Slider/Slider'
import RadioButtonList from '../Radio Button/RadioButtonList'
import ComboBox from '../Combo Box/ComboBox'
import WhitePiece from './Images/rook-white.png';
import MixedPiece from './Images/rook-mixed.png';
import BlackPiece from './Images/rook-black.png';
import ToggleSwitch from '../Toggle Switch/ToggleSwitch';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {Client} from 'dsteem';

//Used for testing purposes. Logs incoming blocks
//const stream = client.blockchain.getBlockStream();
//stream.on('data', (block) => console.log(block))

const dsteem = require('dsteem');
const client = new Client('https://api.steemit.com');
//const USERNAME = "mdhalloran"//TODO replace with current user
//const POSTING_KEY = dsteem.PrivateKey.fromLogin(USERNAME, "P5KEH4V4eKrK2WWxnSGw7UQGSD2waYSps3xtpf9ajegc46PGRUzN", 'posting')//TODO replace with current user

class CreateGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeControlOptions: ["Real Time", "Correspondence"],
            timeControlChosen: "Real Time",
            pieceChosen: "",
            startingColorText: "Starting Color",
            timePerSide: 5,
            increment: 5,

            filterOptions: ["Most Recent", "Least Recent"],
            filterValue: ""
        }
        this.pieceChanged = this.pieceChanged.bind(this);
        this.timePerSideChanged = this.timePerSideChanged.bind(this);
        this.incrementChanged = this.incrementChanged.bind(this);
        this.timeControlChosen = this.timeControlChosen.bind(this);
        this.filterChanged = this.filterChanged.bind(this);
        this.joinViewChanged = this.joinViewChanged.bind(this);
        this.startGame = this.startGame.bind(this);
        this.joinGame = this.joinGame.bind(this);

        //testing purposes
        this.testButton = this.testButton.bind(this);
    }

    /**
     * Called when the starting piece changes
     * @param {string} tag The new piece chosen
     */
    pieceChanged(tag) {
        console.log(tag);
        this.setState({pieceChosen: tag});
        this.setState({startingColorText: "Starting Color: " + tag});
    }

    timePerSideChanged(value) {
        console.log(value);
        this.setState({timePerSide: value});
    }

    incrementChanged(value) {
        console.log(value);
        this.setState({increment: value});
    }

    timeControlChosen(value) {
        console.log(value);
        this.setState({timeControlChosen: value});
    }

    filterChanged(value) {
        console.log(value);
        this.setState({filterValue: value});
    }

    joinViewChanged(e) {
        console.log(e);
        //TODO change join view type
    }

    //test methods----------------------------------------------

    testButton() {
        var gameData = {
            timeControlChosen: this.state.timeControlChosen,
            timePerSide: this.state.timePerSide,
            increment: this.state.increment,
            startingColor: this.state.pieceChosen
        }

        if (this.props != null)
            this.props.switchToLive(gameData, false);
    }

    //end test methods--------------------------------------------

    //TODO
    startGame() {
        var gameData = {
            timeControlChosen: this.state.timeControlChosen,
            timePerSide: this.state.timePerSide,
            increment: this.state.increment,
            startingColor: this.state.pieceChosen
        }

        //Sends to blockchain TODO update with webrtc
        // client.broadcast.json({ 
        //         required_auths: [],
        //         required_posting_auths: [USERNAME],
        //         id: 'chess-game',
        //         json: JSON.stringify(data)
        //     }, POSTING_KEY)
        // .then(
        //     function(result) {
        //         console.log("success!");
        //         console.log(result);
        //     },
        //     function(error) {
        //         console.error(error);
        //         alert("Something went wrong!")
        //     }
        // );

        //this.state.localConnection.createOffer().then(offer => {
        //    console.log(offer);
        if (this.props != null)
            this.props.switchToLive(gameData, true);
        // });
    }

    grabJoinData() {
        //TODO
        return [{
            name: 'John Smith',
            type: 'Real Time',
            time: '10-0',
            posted: '2 minutes'
        },
            {
                name: 'John Smith',
                type: 'Real Time',
                time: '10-0',
                posted: '2 minutes'
            }];
    }

    joinGame(e) {
        client.database.getBlock(30903911)
            .then(
                function (result) {
                    console.log(result);
                },
                function (error) {
                    console.log(error);
                }
            );

        client.database.getBlockHeader(30903911)
            .then(
                function (result) {
                    console.log(result);
                },
                function (error) {
                    console.log(error);
                }
            );

        const joinStream = client.blockchain.getBlockStream({mode: dsteem.BlockchainMode.Latest}, 30903911);
        joinStream.on('data', (block) => console.log(block));
    }

    render() {
        return (
            <div className="CreateGame">
                <div className="mainDiv">
                    <h1 className="half">Create Game</h1>
                    <h1 className="half">Join Game</h1>
                </div>
                <div className="mainDiv">
                    <div className="box half">
                        <RadioButtonList defaultValue={this.state.timeControlChosen}
                                         options={this.state.timeControlOptions}
                                         onTimeControlChosen={this.timeControlChosen}
                                         labelPadding="100px"/>
                        <hr noshade="true"/>
                        <h3>Time Per Side</h3>
                        <Slider min="1"
                                max="10"
                                value={this.state.timePerSide}
                                step="0.5"
                                unit="Minutes"
                                onValueChanged={this.timePerSideChanged}/>
                        <h3>Increment</h3>
                        <Slider min="1"
                                max="10"
                                value={this.state.increment}
                                step="1"
                                unit="Seconds"
                                onValueChanged={this.incrementChanged}/>
                        <hr noshade="true"/>
                        <h3>{this.state.startingColorText}</h3>
                        <PieceList onPieceChanged={this.pieceChanged}/>
                        <button onClick={e => this.startGame()}>Start</button>
                        {/* for testing purposes */}
                        <br/>
                        <button onClick={e => this.testButton()}>Connect not initiating</button>
                    </div>
                    <div className="box half">
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
                        <button onClick={e => this.joinGame(e)}>Join</button>
                    </div>
                </div>
            </div>
        );
    }
}

class PieceList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pieceChosen: "",
            colorChoices: [[BlackPiece, "Black"], [MixedPiece, "Random"], [WhitePiece, "White"]]
        }
    }

    pieceClicked(e) {
        this.setState({pieceChosen: e.target.id});
        this.props.onPieceChanged(e.target.id);
    };

    render() {
        var pieces = this.state.colorChoices.map(([file, tag], index) =>
            <img key={index}
                 id={tag}
                 onClick={e => this.pieceClicked(e)}
                 className={tag === this.state.pieceChosen ? "selectedPiece" : "chessPiece"}
                 src={file}
                 alt={tag}/>
        )
        return (
            <span>
                {pieces}
            </span>
        );
    }
}

export default CreateGame;