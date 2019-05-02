import React, { PureComponent } from 'react';
import Chessboard from 'chessboardjsx'
import Chess from 'chess.js'
import './ChessGame.css'

const DISABLE_BLOCKCHAIN = true;
//var PiecesEnum = Object.freeze({"Black":1, "White":2})

//This component will encapsulate the chessboardjsx ui and the chess.js engine.
class ChessGame extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      fen: "start",
      squareStyles: {},// custom square styles
      pieceSquare: "",// square with the currently clicked piece
    };

    if (this.props.gameData == null) {
      console.error("ChessGame component not passed any game data");
    }
    else {
      console.log("Chess game props: ", this.props.gameData);
      this.gameData = this.props.gameData;
      this.color = this.gameData.startingColor[0].toLowerCase();
    }

    this.gameOver = false;
    this.myTurn = this.color === "w";
    this.opponentColor = this.color === "w" ? "b" : "w";
    this.dropSquareStyle = { boxShadow: "inset 0 0 1px 4px rgb(255, 255, 0)" }; // square styles for active drop square
    this.history = []; //array of past game moves
    this.removeHighlightSquare = this.removeHighlightSquare.bind(this);
    this.highlightSquare = this.highlightSquare.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onMouseOverSquare = this.onMouseOverSquare.bind(this);
    this.onMouseOutSquare = this.onMouseOutSquare.bind(this);
    this.onReceiveMove = this.onReceiveMove.bind(this);
  }

  componentDidMount() {
    this.game = new Chess();
  }

  onReceiveMove(data) {
    console.log("Received move from other player!");
    if (data.color !== this.opponentColor) {
      console.warn("Opponent tried to move wrong piece and it went through!");
      return;
    }
    if (this.isValidMove(data.sourceSquare, data.targetSquare)) {
      this.commitPieceMove(data.sourceSquare, data.targetSquare);
      this.myTurn = true;
    }
  }

  // keep clicked square style and remove hint squares
  removeHighlightSquare() {
    this.setState(({ pieceSquare }) => ({
      squareStyles: this.squareStyling(pieceSquare, this.history)
    }));
  };

  // show possible moves
  highlightSquare(sourceSquare, squaresToHighlight) {
    const highlightStyles = [sourceSquare, ...squaresToHighlight].reduce(
      (a, c) => {
        return {
          ...a,
          ...{
            [c]: {
              background:
                "radial-gradient(circle, #fffc00 36%, transparent 40%)",
              borderRadius: "50%"
            }
          },
          ...this.squareStyling(
            this.state.pieceSquare,
            this.history
          )
        };
      },
      {}
    );

    this.setState(({ squareStyles }) => ({
      squareStyles: { ...squareStyles, ...highlightStyles }
    }));
  };

  onDrop(e) {
    if(this.gameOver) return;
    if (!DISABLE_BLOCKCHAIN && !this.myTurn) {
      console.warn("Tried to move a piece while it was the opponent's turn");
      return;
    }
    console.log("EEEEE", e);

    if (!this.isValidMove(e.sourceSquare, e.targetSquare)) {
      console.warn("Tried to move to an invalid square");
      return;
    }

    var success = this.props.sendData({
      type: "move",
      sourceSquare: e.sourceSquare,
      targetSquare: e.targetSquare,
      piece: e.piece,
      time: Date.now,
      move: this.game.fen(),
      color: this.color
    });

    if(!success) {
      console.error("Failed to send move to opponent");
      return;
    }

    this.commitPieceMove(e.sourceSquare, e.targetSquare);
    this.myTurn = false;
  };

  isValidMove(sourceSquare, targetSquare) {
    var availableMoves = this.game.moves({ square: sourceSquare });
    var filteredMoves = [];
    availableMoves.forEach(option => {
      var move = option;
      //Would put the other player in check
      if(move.charAt(move.length-1) === "+") {
        move = move.substring(0, move.length-1);
      }
      //Would put the other player in checkmate
      if(move.charAt(move.length-1) === "#") {
        move = move.substring(0, move.length-1);
      }
      //Pawn reaching other side
      if(move.includes("=")) {
        move = move.substring(0, move.length-2);
      }
      filteredMoves.push(move.substring(move.length-2, move.length));
    });
    console.log("available moves", availableMoves, sourceSquare, targetSquare);
    return filteredMoves != null && filteredMoves.indexOf(targetSquare) >= 0;
  }

  commitPieceMove(sourceSquare, targetSquare) {
    this.game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q" // always promote to a queen for simplicity. This is for pawns that make it to the other side
    });
    this.setState(({ pieceSquare }) => ({
      fen: this.game.fen(),
      squareStyles: this.squareStyling(pieceSquare, this.history)
    }));
    var gameHistory = this.game.history({verbose: true});
    var mostRecentMove = gameHistory[gameHistory.length-1];
    this.props.addMoveToHistory(mostRecentMove, Date.now());
    this.history.push(mostRecentMove);
    console.log(this.game);//TEMP
    if(this.game.in_stalemate()) {
      this.props.gameEnded();
      alert('Stalemate!');
    }
    if (this.game.in_draw()) {
      this.props.gameEnded();
      alert('A Draw!');
    }
    else if (this.game.in_checkmate()) {
      this.props.gameEnded();
      alert('Checkmate!');
    }
  }

  onMouseOverSquare(square) {
    if(this.gameOver || !this.myTurn) return;

    // get list of possible moves for this square
    var moves = this.game.moves({
      square: square,
      verbose: true
    });

    // exit if there are no moves available for this square
    if (moves.length === 0) return;

    var squaresToHighlight = [];
    for (var i = 0; i < moves.length; i++) {
      squaresToHighlight.push(moves[i].to);
    }

    this.highlightSquare(square, squaresToHighlight);
  };

  onMouseOutSquare(square) {
    this.removeHighlightSquare(square);
  }

  squareStyling(pieceSquare, history) {
    const sourceSquare = history.length && history[history.length - 1].from;
    const targetSquare = history.length && history[history.length - 1].to;

    return {
      [pieceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
      //style of square piece was just moved from
      ...(history.length && {
        [sourceSquare]: {
          backgroundColor: "rgba(255, 255, 0, 0.4)"
        }
      }),
      //style of square piece was just moved to
      ...(history.length && {
        [targetSquare]: {
          backgroundColor: "rgba(255, 255, 0, 0.4)"
        }
      })
    };
  };

  endGame() {
    this.gameOver = true;
  }

  render() {
    const { squareStyles } = this.state;

    return (
        <Chessboard id='chessboard'
          position={this.state.fen}
          onDrop={e => this.onDrop(e)}
          orientation={this.color === "b" ? "black" : "white"}
          onMouseOverSquare={e => this.onMouseOverSquare(e)}
          onMouseOutSquare={e => this.onMouseOutSquare(e)}
          squareStyles={squareStyles}
          dropSquareStyle={this.dropSquareStyle} />
    );
  }
}

export default ChessGame;