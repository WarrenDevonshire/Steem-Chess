import React from 'react';
import ReactDOM from 'react-dom';
import Chatbox from './Chatbox';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Chatbox/>, div);
    ReactDOM.unmountComponentAtNode(div);
});