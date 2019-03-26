import React, { Component } from 'react';
import Chessboard from 'chessboardjsx'
import Chess from 'chess.js'
import './ChessGame.css';
//This component will encapsulate the chessboardjsx ui and the chess.js engine.
class ChessGame extends Component {
  render() {
    return (
      <div className="ChessGame" class='ChessGame'>
        <Chessboard position='start'/>
      </div>
    );
  }
}
export default ChessGame;
