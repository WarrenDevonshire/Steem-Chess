import React, {Component} from 'react';
import './Menubar.css';
import {Link} from 'react-router-dom';
import Login from '../Login/Login';


class Menubar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            api: this.props.api
        }
    }

    render() {
        return (


            <div className="Menu">
                <h1>Steem Chess</h1>
                <ul>
                    <li><Link to="/Play">Play</Link></li>
                    <li><Link to="/">Trending</Link></li>
                    <li><Link to="/New">New</Link></li>
                    <li><Link to="/Hot">Hot</Link></li>
                    <li><Link to={"/Login"}>Login</Link></li>
                </ul>
                <form>
                    <input type="text" placeholder="Search"/>
                    <button type="submit"></button>
                </form>
            </div>

        )
    }
}

export default Menubar;