
import React, { Component } from 'react';
import ChessGame from '../ChessGame/ChessGame';
import Chatbox from '../Chatbox/Chatbox'
import Timer from '../Timer/Timer';

export default class LiveMatch extends Component {

        render(){

            return (

                <div id="liveMatch">
                    <ChessGame/>
                    <Chatbox/>  
                    <Timer/>              
                </div>

            )

        }

}