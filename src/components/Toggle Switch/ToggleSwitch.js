import React, { Component } from "react";
import Switch from "react-switch";

//Code taken from https://reactjsexample.com/draggable-toggle-switch-component-for-react/
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
    this.setState({ checked });
    if(checked)
    {
        this.setState({text:this.props.trueText});
    }
    else
    {
        this.setState({text:this.props.falseText});
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
            offColor="#0000ff"
            onColor="#4CAF50"
            offHandleColor="#ffffff"
            onHandleColor="#ffffff"
            checkedIcon={false}
            uncheckedIcon={false}/>
      </label>
    );
  }
}

export default ToggleSwitch;