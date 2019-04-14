import React from 'react';
import ReactDOM from 'react-dom';
import JoinGameBox from './JoinGameBox';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<JoinGameBox/>, div);
    ReactDOM.unmountComponentAtNode(div);
});