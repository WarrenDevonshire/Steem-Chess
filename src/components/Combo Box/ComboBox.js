import React, {Component} from 'react';
import './ComboBox.css'

//Options should be passed in with the form:
//[text, text, text]
class ComboBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valueChosen: this.props.defaultValue ? this.props.defaultValue : ""
        }
    }

    optionClicked(e) {
        console.log(e.target.value);
        this.setState({valueChosen: e.target.value});
        this.props.onSelectedChanged(e.target.value);
    };

    render() {
        var options = this.props.options.map((text) =>
            <option key={text.toString()}
                    value={text.toString()}>{text}</option>
        )
        return (
            <select className="select green rounded"
                    value={this.state.valueChosen}
                    onChange={e => this.optionClicked(e)}>
                {options}
            </select>
        );
    }
}

export default ComboBox;