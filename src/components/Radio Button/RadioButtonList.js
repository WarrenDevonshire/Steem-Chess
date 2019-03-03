import React, {Component} from 'react';
import './RadioButtonList.css'

//Options should be passed in with the form:
//[value, value, value]
class RadioButtonList extends Component {
    constructor(props){
        super(props);
        this.state = {
            valueChosen: this.props.defaultValue,
        }
    }

    optionClicked(e) {
        console.log(e);
        this.setState({valueChosen:e.target.id});
        this.props.onTimeControlChosen(e.target.id);
    };

    render() {
        var options = this.props.options.map((tag) =>
        <span onClick={e => this.optionClicked(e)}>
            <span key={tag.toString()}
                id={tag.toString()}
                onClick={e => this.optionClicked(e)}
                className={this.state.valueChosen == tag ? "checked" : "unchecked"}
                name="Time Control"
                value={tag}/>
            <label htmlFor={tag.toString()} 
                className="label"
                padding-right={this.props.labelPadding}
                id={tag.toString()}>{tag}
            </label>
        </span>
            )
        return (
            <form className="form">
                {options}
            </form>
        );
    }
}

export default RadioButtonList;