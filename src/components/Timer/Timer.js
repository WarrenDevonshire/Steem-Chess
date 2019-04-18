import React from "react";

//import './Timer.css'

class TimerInput extends React.Component {
    render() {
      return (
          <div>
          <h3>Input your Game Timer</h3>
          <input type="number" value={this.props.value} onChange={this.props.handleChange} required />
        </div>
      );
    }
  }

class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            minutes: 0,
            seconds: '00',
            isClicked : false
        }
        this.secondsReamaining = this.secondsReamaining;
        this.intervalHandle = this.intervalHandle;
        this.handleTicking = this.handleTicking.bind(this); 
    }

handleChange(event) {

    this.setState({
        value: event.CurrentTarget.value
    })
}

handleTicking() {
    var min = Math.floor(this.secondsReamaining / 60);
    var sec = this.secondsRemaining - (min * 60);

    this.setState({
        value: min,
        seconds: sec,
    })


if(sec < 10){
    this.setState ({
        seconds: "0" + this.state.seconds,
    })
}

if (min < 10) {
    this.setState({
      value: "0" + min,
    })

    if (min === 0 & sec === 0) {
        clearInterval(this.intervalHandle);
    }

}
}

handleDownTimer() {

      this.intervalHandle = setInterval(this.handleTicking, 1000);
      let time = this.state.value;
      this.secondsReamaining = time * 60;
      this.setState({
        isClicked : true
    })  
}

handleTimerStop(e)  {
    e.preventDefault();
    this.setState({timerStarted:false, timerStopped:true});
    clearInterval(this.timer);
}

handleTimerReset(){
    this.setState({timerStarted:false, timerStopped:true, seconds:0, minutes:0, hours:0});
    clearInterval(this.timer);
}

render() {
    const clicked = this.state.isClicked;
    if(clicked){return (
        <div>
          <div className="row">
            <div className="col-md-4"></div>
            <div className="col-md-4">
              <div value={this.state.value} seconds={this.state.seconds} />
            </div>
          </div>
        </div>
      );}
   else{
       return(
        <div>
        <div className="row">
          <div className="col-md-4"></div>
          <div className="col-md-4">
            <TimerInput value={this.state.value} handleChange={this.handleChange} />
            <div value={this.state.value} seconds={this.state.seconds} />
            <div startCountDown={this.startCountDown} value={this.state.value} />
          </div>
        </div>
      

    <div className = "timer-controls"></div>  
    <button className = "btn btn-success" onClick= {this.handleDownTimer.bind(this)}>Start </button>
    <button className = "btn btn-danger" onClick = {this.handleTimerStop.bind(this)}>Stop </button>
    <button className = "btn btn-info" onClick = {this.handleTimerReset.bind(this)}>Reset</button> 

    </div>
);} 

}
}


export default Timer;