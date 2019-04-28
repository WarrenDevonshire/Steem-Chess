import React from 'react';
import ReactDOM from 'react-dom';
import GameHistory from './GameHistory';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<GameHistory/>, div);
    ReactDOM.unmountComponentAtNode(div);
});