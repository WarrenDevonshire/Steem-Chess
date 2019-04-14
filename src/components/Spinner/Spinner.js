import React, {Component} from "react";
import SpinnerImage from "./spinner.png"
import './Spinner.css';

class Spinner extends Component {
    constructor(props) {
        super(props);
    }
    render() {

        return (
            <div>
                { this.props.enabled ? <img className="spinner" src={SpinnerImage} alt="spinner" /> : null }
            </div>
        );
    }
}

export default Spinner;