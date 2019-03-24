import React, {Component} from 'react';
import './Login.css';
import {Link} from 'react-router-dom';
import sc2 from "steemconnect";

class Login extends Component {
    constructor(props) {
        super(props);
        let api = sc2.Initialize({
            app: 'steemchessorg',
            callbackURL: 'http://localhost:3000/Success',
            accessToken: 'access_token',
            scope: ['vote', 'comment']
        });
        let link = api.getLoginURL();
        this.state = {
            api: this.props.api,
            link: link
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