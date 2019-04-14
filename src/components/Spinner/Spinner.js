import React, {Component} from "react";
import SpinnerImage from "./spinner.png"
import './Spinner.css';

class Spinner extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            enabled: this.props.enabled,
        }

        console.log("fdsafdsafds", this.props);
    }
    render() {

        return (
            <div>
                { this.state.showResults ? <img className="spinner" src={SpinnerImage} alt="spinner" /> : null }
            </div>
        );
    }
}

export default Spinner;