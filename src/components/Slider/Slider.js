import React, {Component} from 'react';
import './Slider.css'

class Slider extends Component{
    render(){
        return (
            <div class="slidecontainer">
  <p>Custom range slider:</p>
  <input type="range" min="1" max="100" value="50" class="slider" id="myRange"/>
</div>
        );
    }
}


export default Slider;