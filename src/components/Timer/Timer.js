import React, { Component } from 'react';
import './Timer.css'

const tps = 30;
const rate = 1000/tps;

/**
 * A component used to keep track of how much time
 * a player has left in a match
 */
class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ended: false,
            display: null,
        }
        this.initialize();
    }

    initialize() {
        //Using this instead of counting down from settimeout prevents 
        //timer from stopping when game is not the current tab
        this.startTime = Date.now();
        this.on = false;
        var hours = 0, minutes = 0, seconds = 0;
        if (this.props.hours != null) {
            hours = this.props.hours;
        }
        if (this.props.minutes != null) {
            minutes = this.props.minutes;
        }
        if (this.props.seconds != null) {
            seconds = this.props.seconds;
        }
        this.timeLeft = ((((hours * 60) + minutes) * 60) + seconds) * 1000;
        this.updateDisplay();
    }

    start(startTime = startTime || Date.now()) {
        this.on = true;
        this.endTime = startTime + this.timeLeft;
        this.tickLoop(); 
    }

    tickLoop() {
        setTimeout(() => {
            this.updateDisplay();
            this.timeLeft = this.endTime - Date.now();
            if(this.timeLeft <= 0) {
                this.on = false;
            }
            if(this.on) {
                this.start();
            }
        }, rate);
    }

    stop() {
        this.on = false;
    }

    updateDisplay() {
        var minutes = Math.floor(this.timeLeft / 60000);
        if(minutes < 10) {
            minutes = "0" + minutes;
        }
        var seconds = Math.floor((this.timeLeft % 60000)/1000);
        if(seconds < 10) {
            seconds = "0" + seconds;
        }
        this.setState({display:minutes + ":" + seconds});
    }

    render() {
        return (
            <div className="container">
                <h2 className="text-center"> Chess Game Timer</h2>
                <div className="timer-container">
                    <div className="current-timer">
                        {this.state.display}

                        <div className="timer-controls"></div>
                        <button className="btn btn-success" onClick={this.start.bind(this)}>Start </button>
                        <button className="btn btn-danger" onClick={this.stop.bind(this)}>Stop </button>
                        <button className="btn btn-info" onClick={this.initialize.bind(this)}>Reset</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Timer;