import React, {Component} from 'react';
import './Login.css';
import {PrivateKey} from 'dsteem';
import {loadState, saveState} from "../../../components/localStorage";
import {withRouter} from "react-router-dom";


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: "",
            password: ""
        };
        this.handleAccountChange = this.handleAccountChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    async handleAccountChange(e){
        await this.setState({account: e.target.value});
        console.log(this.state.account);
    }

    async handlePasswordChange(e){
        await this.setState({password: e.target.value});
        console.log(this.state.password);
    }

    handleLogin(e){
        const pKey = PrivateKey.fromLogin(this.state.account, this.state.password, 'posting');
        saveState(this.state.account, pKey);
        this.props.history.push('/');
    }

    render() {
        return (
            <div className="Auth">
                <form>
                    <label>
                        Account:
                        <input type="text" value={this.state.account}  onChange={this.handleAccountChange}/>
                    </label>

                    <label>
                        Password:
                        <input type="password" value={this.state.password}  onChange={this.handlePasswordChange}/>
                    </label>
                    <button onClick={this.handleLogin}>Login</button>
                </form>
        </div>
        )
    }
}

export default Login;