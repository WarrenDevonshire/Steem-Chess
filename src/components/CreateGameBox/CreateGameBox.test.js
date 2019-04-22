import React from 'react';
import ReactDOM from 'react-dom';
import CreateGameBox from './CreateGameBox';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<CreateGameBox/>, div);
    ReactDOM.unmountComponentAtNode(div);
});