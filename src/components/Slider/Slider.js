import React, {Component} from 'react';
import './Slider.css'

class Slider extends Component{
    render(){
        return (
            <div className="Slider">
            <circle name="valueCircle"
                    width="5px" 
                    color="#333"
                    />
            <line width="100dp" height="3dp" color="#333"/>
            </div>
        );
    }
}


export default Slider;