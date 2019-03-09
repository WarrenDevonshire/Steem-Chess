import React from "react";
import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from 'popper.js';
//import './Timer.css'

class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timerStarted: false,
            timerStopped: true,
            hours: 0,
            minutes: 0,
            seconds: 0,
        }
    }

handleTimerStart(e) {

    e.preventDefault();
    if(this.state.timerStopped){

        setInterval(() => {

            this.setState({timerStarted: true, timerStopped: false});
            if(this.state.timerStarted) {

                if(this.state.seconds >= 60) {

                    this.setState((prevState) => ({minutes: prevState.minutes + 1, seconds: 0}));
                }
                if(this.state.minutes >= 60) {

                    this.setState((prevState) => ({hours: prevState.hours + 1, minutes: 0, seconds: 0}));
                }

                this.setState((prevState) => ({ seconds: prevState.seconds + 1}));

            }
        
        }, 1000);
    }
}

render() {
    return (
        <div className = "container">
        <h2 className= "text-center"> Chess Game Timer</h2>
        <div className = "timer-container">
        <div className = "current-timer">
        {this.state.hours + ":" +  this.state.minutes + ":" + this.state.seconds}

        <div className = "timer-controls"></div>
            <button className = "btn btn-success" onClick= {this.handleTimerStart.bind(this)}>Start </button>
            <button className = "btn btn-danger">Stop </button>
            <button className = "btn btn-info">Reset</button>

        </div>
        </div>
        </div>
    );
}
}

export default Timer;