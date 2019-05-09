import React, { Component } from "react";
import "./GameOptions.css";

import DrawImage from "./Images/Draw.png"
import ResignImage from "./Images/Resign.png";

class GameOptions extends Component {
    constructor(props) {
        super(props);

        this.gameFinished = false;

        this.onDrawClicked = this.onDrawClicked.bind(this);
        this.onResignClicked = this.onResignClicked.bind(this);
    }

    onDrawClicked(e) {
        if (!this.gameFinished && window.confirm("Are you sure you want to request a draw?")) {
            this.props.drawClicked();
        }
    }

    onResignClicked(e) {
        if (!this.gameFinished && window.confirm("Are you sure you want to resign?")) {
            this.props.resignClicked();
        }
    }

    render() {
        return (
            <div id="gameOptionsDiv">
                <img onClick={e => this.onDrawClicked(e)}
                className="gameOption"
                    src={DrawImage}
                    alt="Draw" />
                <img onClick={e => this.onResignClicked(e)}
                className="gameOption"
                    src={ResignImage}
                    alt="Resign" />
            </div>
        );
    }
}

export default GameOptions;