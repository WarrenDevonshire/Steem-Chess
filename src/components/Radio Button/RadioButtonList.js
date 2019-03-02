import React, {Component} from 'react';
import './RadioButtonList.css'

//Options should be passed in with the form:
//[[id, value],[id, value],[id, value]]
class RadioButtonList extends Component {
    constructor(props){
        super(props);
        this.state = {
            indexChosen: this.props.defaultIndex,
        }
    }

    optionClicked(e) {
        console.log(e);
        this.setState({indexChosen:e.target.id});
        this.props.onTimeControlChosen(e.target.id);
    };

    render() {
        var options = this.props.options.map(([index, tag]) =>
        <div className="horizontal" 
            onClick={e => this.optionClicked(e)}>
            <span key={index}
                id={index}
                onClick={e => this.optionClicked(e)}
                className={this.state.indexChosen == index ? "checked" : "unchecked"}
                name="Time Control"
                value={tag}/>
            <label htmlFor={index} 
                className="label"
                id={index}>{tag}
            </label>
        </div>
            )
        return (
            <form className="form">
                {options}
            </form>
        );
    }
}

export default RadioButtonList;