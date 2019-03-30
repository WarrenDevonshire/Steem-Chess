import React, {Component} from 'react';
import './Login.css';
import {loadState, saveState} from "../../../components/localStorage";


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: "",
            password: ""
        };

    }


    render() {
        return (
            <div className={Login}>
                <a href={this.state.link}>Login</a>
            </div>
        )
    }
}

export default Login;