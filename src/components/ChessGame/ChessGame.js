import React, { Component } from 'react';
import Chessboard from 'chessboardjsx'
import Chess from 'chess.js'

//This component will encapsulate the chessboardjsx ui and the chess.js engine.
class ChessGame extends Component {

    constructor(props) {
        super(props);

        this.state = {
            fen: "start",
            dropSquareStyle: {},// square styles for active drop square
            squareStyles: {},// custom square styles
            pieceSquare: "",// square with the currently clicked piece
            square: "",// currently clicked square
            history: [],// array of past game moves

            peer: this.props.peer,
        };

        this.removeHighlightSquare = this.removeHighlightSquare.bind(this);
        this.highlightSquare = this.highlightSquare.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onMouseOverSquare = this.onMouseOverSquare.bind(this);
        this.onMouseOutSquare = this.onMouseOutSquare.bind(this);
        this.onDragOverSquare = this.onDragOverSquare.bind(this);
        this.onSquareClick = this.onSquareClick.bind(this);
    }

    componentDidMount() {
        this.game = new Chess();
    }

    // keep clicked square style and remove hint squares
    removeHighlightSquare() {
        this.setState(({ pieceSquare, history }) => ({
            squareStyles: squareStyling({ pieceSquare, history })
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
                    ...squareStyling({
                        history: this.state.history,
                        pieceSquare: this.state.pieceSquare
                    })
                };
            },
            {}
        );

        this.setState(({ squareStyles }) => ({
            squareStyles: { ...squareStyles, ...highlightStyles }
        }));
    };

    onDrop(e) {
        // see if the move is legal
        var move = this.game.move({
            from: e.sourceSquare,
            to: e.targetSquare,
            promotion: "q" // always promote to a queen for example simplicity
        });

        // illegal move
        if (move === null) return;

        //update board
        this.setState(({ history, pieceSquare }) => ({
            fen: this.game.fen(),
            history: this.game.history({ verbose: true }),
            squareStyles: squareStyling({ pieceSquare, history })
        }));

        //Send data to other player
        this.props.sendData({
            type: "move",
            sourceSquare: e.sourceSquare,
            targetSquare: e.targetSquare,
            piece: e.piece,
            time: Date.now
        });
    };

    onMouseOverSquare(square) {
        console.warn(this);
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

    // central squares get diff dropSquareStyles
    onDragOverSquare(square) {
        this.setState({
            dropSquareStyle:
                square === "e4" || square === "d4" || square === "e5" || square === "d5"
                    ? { backgroundColor: "cornFlowerBlue" }
                    : { boxShadow: "inset 0 0 1px 4px rgb(255, 255, 0)" }
        });
    };

    onSquareClick(square) {
        this.setState(({ history }) => ({
            squareStyles: squareStyling({ pieceSquare: square, history }),
            pieceSquare: square
        }));

        var move = this.game.move({
            from: this.state.pieceSquare,
            to: square,
            promotion: "q" // always promote to a queen for example simplicity
        });

        // illegal move
        if (move === null) return;

        this.setState({
            fen: this.game.fen(),
            history: this.game.history({ verbose: true }),
            pieceSquare: ""
        });
    };

    render() {
        const { fen, dropSquareStyle, squareStyles } = this.state;

        return this.props.children({
            squareStyles,
            position: fen,
            onMouseOverSquare: this.onMouseOverSquare,
            onMouseOutSquare: this.onMouseOutSquare,
            onDrop: this.onDrop,
            dropSquareStyle,
            onDragOverSquare: this.onDragOverSquare,
            onSquareClick: this.onSquareClick,
            onSquareRightClick: this.onSquareRightClick
        });
    }
}

export default function WithMoveValidation() {
    return (
        <div>
            <ChessGame>
                {({
                    position,
                    onDrop,
                    onMouseOverSquare,
                    onMouseOutSquare,
                    squareStyles,
                    dropSquareStyle,
                    onDragOverSquare,
                    onSquareClick,
                    onSquareRightClick
                }) => (
                        <Chessboard
                            id="chessGame"
                            width={320}
                            position={position}
                            onDrop={onDrop}
                            onMouseOverSquare={onMouseOverSquare}
                            onMouseOutSquare={onMouseOutSquare}
                            boardStyle={{
                                borderRadius: "5px",
                                boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
                            }}
                            squareStyles={squareStyles}
                            dropSquareStyle={dropSquareStyle}
                            onDragOverSquare={onDragOverSquare}
                            onSquareClick={onSquareClick}
                            onSquareRightClick={onSquareRightClick}
                        />
                    )}
            </ChessGame>
        </div>
    );
}

const squareStyling = ({ pieceSquare, history }) => {
    const sourceSquare = history.length && history[history.length - 1].from;
    const targetSquare = history.length && history[history.length - 1].to;

    return {
        [pieceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
        ...(history.length && {
            [sourceSquare]: {
                backgroundColor: "rgba(255, 255, 0, 0.4)"
            }
        }),
        ...(history.length && {
            [targetSquare]: {
                backgroundColor: "rgba(255, 255, 0, 0.4)"
            }
        })
    };
};
