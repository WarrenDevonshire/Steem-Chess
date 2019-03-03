import React, {Component} from 'react';
import './ComboBox.css'

//Options should be passed in with the form:
//[[id, text],[id, text],[id, text]]
class ComboBox extends Component {
    constructor(props){
        super(props);
        this.state = {
            valueChosen: ""
        }
    }

    optionClicked(e) {
        console.log(e.target.value);
        this.setState({valueChosen:e.target.value});
        this.props.onSelectedChanged(e.target.value);
    };

    render() {
        var options = this.props.options.map(([index, text]) =>
            <option key={index}
                className="option"
                value={text}>{text}</option>
            )
        return (
            <select className="select"
                onChange={e => this.optionClicked(e)}>
                {options}
            </select>
        );
    }
}

export default ComboBox;