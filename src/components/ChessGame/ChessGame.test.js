import React from 'react';
import ReactDOM from 'react-dom';
import ChessGame from './ChessGame';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ChessGame/>, div);
    ReactDOM.unmountComponentAtNode(div);
});