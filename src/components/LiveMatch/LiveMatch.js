
import React, { Component } from 'react';
import ChessGame from '../ChessGame/ChessGame';
import Chatbox from '../Chatbox/Chatbox'

export default class LiveMatch extends Component {

        render(){

            return (

                <div id="liveMatch">
                    <ChessGame/>
                    <Chatbox/>                
                </div>

            )

        }

}