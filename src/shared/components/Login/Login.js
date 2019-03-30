import React, {Component} from 'react';
import './Login.css';
import {loadState, saveState} from "../../../components/localStorage";


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: "",
            password: ""
        };


    }


    render() {
        return (
            <div className={Login}>
                <form>

                    <label>account</label>
                    <input type="text" name="account" onChange={this.handleAccountChange} />

                    <label>Password</label>
                    <input type="password" name="password" onChange={this.handlePasswordChange} />

                </form>
            </div>
        )
    }
}

export default Login;