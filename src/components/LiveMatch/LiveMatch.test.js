import React from 'react';
import ReactDOM from 'react-dom';
import LiveMatch from './LiveMatch';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<LiveMatch/>, div);
    ReactDOM.unmountComponentAtNode(div);
});