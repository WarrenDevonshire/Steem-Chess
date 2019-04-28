import React from 'react';
import ReactDOM from 'react-dom';
import ComboBox from './ComboBox';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ComboBox/>, div);
    ReactDOM.unmountComponentAtNode(div);
});