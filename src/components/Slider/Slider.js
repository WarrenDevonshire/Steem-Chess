import React, {Component} from 'react';
import './Slider.css'

class Slider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value ? this.props.value : 0
        }
    }

    valueChanged(e) {
        this.setState({value: e.target.value});
        this.props.onValueChanged(e.target.value);
    }

    render() {
        return (
            <div className="slidecontainer">
                <p>{this.state.value} {this.props.unit}</p>
                <input type="range"
                       min={this.props.min ? this.props.min : 0}
                       max={this.props.max ? this.props.max : 100}
                       step={this.props.step ? this.props.step : 1}
                       value={this.state.value}
                       className="slider"
                       id="myRange"
                       onChange={e => this.valueChanged(e)}/>
            </div>
        );
    }
}


export default Slider;