import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import '../../../components/App.css';

// We created a component with a simple arrow function.
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title ? this.props.title : "SteemChess",
            url: 'http://localhost:3000'
        }
    }

    render() {
        return (
            <header>
                <h1>{this.state.title}</h1>
                <ul id="menubar-list">
                    <li><Link to="/Play">Play</Link></li>
                    <li><Link to="/">Trending</Link></li>
                    <li><Link to="/New">New</Link></li>
                    <li><Link to="/Hot">Hot</Link></li>
                    <li><Link to='/Compose'>Compose</Link></li>
                    <li><Link to={"/Login"}>{localStorage.getItem('login') === null ? 'Login' : 'Logout'}</Link></li>
                </ul>
                {/* <div class="search-box">
                        <input type="search" id="search" placeholder="Search..." />
                </div> */}
                <h1/>
            </header>
        );
    }
}

// Even with Functional Components we are able to validate our
// PropTypes.
Header.propTypes = {
    title: PropTypes.string.isRequired,
    url: PropTypes.string
};

export default Header;
