import React, {Component} from "react";
import Switch from "react-switch";

//Some code taken from https://reactjsexample.com/draggable-toggle-switch-component-for-react/
class ToggleSwitch extends Component {
    constructor(props) {
        super(props);
        this.state =
            {
                checked: false,
                text: this.props.falseText
            };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(checked) {
        this.setState({checked});
        if (checked) {
            if (this.props.trueText != null)
                this.setState({text: this.props.trueText});
            else
                this.setState({text: ""});
        } else {
            if (this.props.falseText != null)
                this.setState({text: this.props.falseText});
            else
                this.setState({text: ""});
        }
        this.props.onChange(checked);
    }

    render() {

        return (
            <label htmlFor="normal-switch"
                   className="horizontal">
                <span>{this.state.text}</span>
                <Switch
                    onChange={this.handleChange}
                    checked={this.state.checked}
                    id="normal-switch"
                    offColor={this.props.offColor ? this.props.offColor : "#acb8b9"}
                    onColor={this.props.onColor ? this.props.onColor : "#4CAF50"}
                    checkedIcon={this.props.checkedIcon ? this.props.checkedIcon : false}
                    uncheckedIcon={this.props.uncheckedIcon ? this.props.unCheckedIcon : false}/>
            </label>
        );
    }
}

export default ToggleSwitch;