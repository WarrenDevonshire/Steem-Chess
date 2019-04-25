import React, {Component} from 'react';
import './Login.css';
import { Client, PrivateKey } from 'dsteem';
import {loadState, saveState} from "../../../components/localStorage";
import {withRouter} from "react-router-dom";

const client = new Client('https://api.steemit.com');

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
        
        try{
            var pKey = PrivateKey.fromString(this.state.password);
            saveState(this.state.account, this.state.password, "loggedIn");
            this.props.history.push('/');

           /*const vote = {

            voter: this.state.account,
            author: 'almost-digital',
            permlink: 'dsteem-is-the-best',
            weight: 0 //needs to be an integer for the vote function

            };

            client.broadcast.vote(vote, pKey)
            .then(result => {

                //console.log('Success! Logged In:', result);
                alert("Success.");
                saveState(this.state.account, this.state.password, "loggedIn");
                this.props.history.push('/');

            },
            function (error) {

                //console.error(error);
                alert("Invalid username or password.");

            })*/
           
        }
        catch(error)
        {
            console.log(error);
            alert("Invalid username or password.");
            
        }
        
        

    }

    render() {
        return (
            <div className="Login">
                
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
                
        </div>
        )
    }
}

export default Login;