import React, {Component} from 'react';
import './Slider.css'

class Slider extends Component{
    constructor(props){
        super(props);
        this.state = {
            value: 0
        }
        this.setState({value:this.props.value});
    }

    sliderDrag(e) {
        this.setState({value: e.target.value});
    }

    render(){
        return (
            <div class="slidecontainer">
                <p>{this.state.value} {this.props.unit}</p>
                <input type="range" 
                    min={this.props.min} 
                    max={this.props.max} 
                    value={this.state.value} 
                    class="slider" 
                    id="myRange"
                    onChange={e => this.sliderDrag(e)}/>
            </div>
        );
    }
}


export default Slider;