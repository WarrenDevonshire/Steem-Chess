import React from 'react';

// Since we don't have props, we can directly return our JSX.
const Footer = () => (
    <footer>&copy; Steem-Chess {(new Date()).getFullYear()}</footer>
);

export default Footer;

