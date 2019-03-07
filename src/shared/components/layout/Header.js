import React from 'react';
import PropTypes from 'prop-types';
import Menubar from '../Menu/Menubar';

// We created a component with a simple arrow function.
const Header = props => {
    const {
        title = '',
        url = 'http://localhost:3000'
    } = props;

    return (
        <header className="App-header">
            <h1 className="App-title">{title}</h1>
            <Menubar />
        </header>
    );
};

// Even with Functional Components we are able to validate our 
// PropTypes.
Header.propTypes = {
    title: PropTypes.string.isRequired,
    url: PropTypes.string
};

export default Header;
