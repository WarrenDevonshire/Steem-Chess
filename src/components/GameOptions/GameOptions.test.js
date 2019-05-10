import React from 'react';
import ReactDOM from 'react-dom';
import GameOptions from './GameOptions';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<GameOptions/>, div);
    ReactDOM.unmountComponentAtNode(div);
});