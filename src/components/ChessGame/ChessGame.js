import React, { PureComponent } from 'react';
import Chessboard from 'chessboardjsx'
import Chess from 'chess.js'

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
      console.log(this.gameData);
      console.log("Starting color: " + this.gameData.startingColor);
      this.gameData = this.props.gameData;
      this.color = this.gameData.startingColor;
    }
    this.opponentColor = { 'w': 'b', 'b': 'w' };
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
    if (!(data.color === this.opponentColor[this.state.color]))
      return;
    if (this.isValidMove(data.sourceSquare, data.targetSquare)) {
      console.log("CALLED")
      this.commitPieceMove(data.move);
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
    if (!e.piece.startsWith(this.state.color))
      return;
    if (console.log(this.isValidMove(e.sourceSquare, e.targetSquare))) {
      //Send data to other player
      var success = this.props.sendData({
        type: "move",
        sourceSquare: e.sourceSquare,
        targetSquare: e.targetSquare,
        piece: e.piece,
        time: Date.now,
        move: this.game.fen(),
        color: this.state.color
      });

      //update board
      if (success === true || success === false) {
        this.commitPieceMove(this.game.fen());
      }
    }
  };

  isValidMove(sourceSquare, targetSquare) {//TODO skips turn if false. This should use this.game.moves to check instead
    return this.game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q" // always promote to a queen for example simplicity TODO don't know what this is
    }) !== null;
  }

  commitPieceMove(move) {
    this.setState(({ pieceSquare }) => ({
      fen: move,
      squareStyles: this.squareStyling(pieceSquare, this.history)
    }));
    this.history = this.game.history({ verbose: true });
    if (this.game.in_draw()) {
      alert('A Draw!');
    }
    else if (this.game.in_checkmate()) {
      alert('Checkmate!');
    }
    else if (this.game.in_checkmate()) {
      alert('Oof a stalemate');
    }
  }

  onMouseOverSquare(square) {
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

  render() {
    const { squareStyles } = this.state;

    return (
      <div>
        <Chessboard width={320}
          position={this.state.fen}
          onDrop={e => this.onDrop(e)}
          onMouseOverSquare={e => this.onMouseOverSquare(e)}
          onMouseOutSquare={e => this.onMouseOutSquare(e)}
          boardStyle={{
            borderRadius: "5px",
            boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
          }}
          squareStyles={squareStyles}
          dropSquareStyle={this.dropSquareStyle} />
      </div>
    );
  }
}

export default ChessGame;