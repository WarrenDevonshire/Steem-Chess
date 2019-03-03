import React, { Component } from "react";
import Switch from "react-switch";

//Code taken from https://reactjsexample.com/draggable-toggle-switch-component-for-react/
class ToggleSwitch extends Component {
  constructor() {
    super();
    this.state = { checked: false };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(checked) {
    this.setState({ checked });
    this.props.onChange(checked);
  }

  render() {
    return (
      <label htmlFor="normal-switch">
        <span></span>
        <Switch
            onChange={this.handleChange}
            checked={this.state.checked}
            id="normal-switch"
            offColor="#0000ff"
            onColor="#ff00ff"
            offHandleColor="#ffffff"
            onHandleColor="#ffffff"
            checkedIcon=""
            uncheckedIcon=""/>
      </label>
    );
  }
}

export default ToggleSwitch;