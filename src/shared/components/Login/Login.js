import React, {Component} from 'react';
import './Login.css';
import {loadState, saveState} from "../../../components/localStorage";
import {withRouter} from "react-router-dom";


class Login extends Component {
    
            constructor(props) {
                super(props);

                if(localStorage.getItem('login') !== null)
                {
                    localStorage.removeItem('account');
                    localStorage.removeItem('pKey');
                    localStorage.removeItem('login');
                    this.props.history.push('/');
                }

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
        saveState(this.state.account, this.state.password, "loggedIn");
        this.props.history.push('/');
    }

    render() {
        return (
            <div className="Login">
                <form>
                    <label>
                        Account:
                        <input type="text" value={this.state.account}  onChange={this.handleAccountChange} id="Account"/>
                    </label>
                    <br/>
                    <label >
                        Password:
                        <input type="password" value={this.state.password}  onChange={this.handlePasswordChange} id="Password"/>
                    </label>
                    <br/>
                    <button onClick={this.handleLogin} id="submit">Login</button>
                </form>
        </div>
        )
    }
}

export default Login;