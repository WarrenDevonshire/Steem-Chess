import React, { Component } from 'react';
import './Timer.css'

const tps = 30;
const rate = 1000 / tps;

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
            timerColor: "timer-paused",
        }
    }

    componentDidMount() {
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

    start(startTime) {
        this.setState({timerColor:"timer-on"})
        if(isNaN(startTime)) {
            startTime = Date.now();
        }
        this.on = true;
        this.endTime = startTime + this.timeLeft;
        this.tickLoop();
    }

    tickLoop() {
        setTimeout(() => {
            this.updateDisplay();
            this.timeLeft = this.endTime - Date.now();
            if (this.on) {
                if (this.timeLeft <= 0) {
                    this.on = false;
                    this.setState({timerColor:"timer-finished"});
                    this.props.timesUp();
                }
                this.tickLoop();
            }
        }, rate);
    }

    pause() {
        this.setState({timerColor:"timer-paused"});
        this.on = false;
    }

    stop() {
        if(this.state.timerColor === "timer-paused") {
            this.setState({timerColor:"timer-blank"});
        }
        this.on = false;
    }

    addTime(seconds) {
        if(isNaN(seconds)) return;
        if (this.on) this.endTime = this.endTime + (seconds * 1000);
        else this.timeLeft = this.timeLeft + (seconds * 1000);
    }

    updateDisplay() {
        var minutes = Math.max(0, Math.floor(this.timeLeft / 60000));
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        var seconds = Math.max(0, Math.floor((this.timeLeft % 60000) / 1000));
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        this.setState({ display: minutes + ":" + seconds });
    }

    render() {
        return (
            <div className={"current-timer " + this.state.timerColor}>
                {this.state.display}
            </div>
        );
    }
}

export default Timer;