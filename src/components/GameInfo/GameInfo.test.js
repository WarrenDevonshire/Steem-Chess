import React from 'react';
import ReactDOM from 'react-dom';
import GameInfo from './GameInfo';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<GameInfo/>, div);
    ReactDOM.unmountComponentAtNode(div);
});