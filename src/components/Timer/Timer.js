import React from "react";
import ReactDOM from "react-dom";

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

        this.timer = setInterval(() => {

            this.setState({timerStarted: true, timerStopped: false});
            if(this.state.timerStarted) {

                //starts counting minutes if seconds go above 60
                if(this.state.seconds >= 60) {

                    this.setState((prevState) => ({minutes: prevState.minutes + 1, seconds: 0}));
                }

                //starts counting hours if minutes go above 60
                if(this.state.minutes >= 60) {

                    this.setState((prevState) => ({hours: prevState.hours + 1, minutes: 0, seconds: 0}));
                }

                //clears the seconds counter to zero and starts over
                this.setState((prevState) => ({ seconds: prevState.seconds + 1}));

            }
        
        }, 1000);
    }
}

handleTimerStop(e)  {
    e.preventDefault();
    this.setState({timerStarted:false, timerStopped:true});
    clearInterval(this.timer);
}

handleTimerReset(e){
    this.setState({timerStarted:false, timerStopped:true, seconds:0, minutes:0, hours:0});
    clearInterval(this.timer);
}

render() {
    return (
        <div className = "container">
        <h2 className= "text-center"> Chess Game Timer</h2>
        <div className = "timer-container">
        <div className = "current-timer">
        {this.state.hours + ":" +  this.state.minutes + ":" +  this.state.seconds}

        <div className = "timer-controls"></div>

            
            <button className = "btn btn-success" onClick= {this.handleTimerStart.bind(this)}>Start </button>
            <button className = "btn btn-danger" onClick = {this.handleTimerStop.bind(this)}>Stop </button>
            <button className = "btn btn-info" onClick = {this.handleTimerReset.bind(this)}>Reset</button>

        </div>
        </div>
        </div>
    );
}
}

export default Timer;