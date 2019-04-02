import React from 'react';
import ReactDOM from 'react-dom';
import RadioButtonList from './RadioButtonList';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<RadioButtonList/>, div);
    ReactDOM.unmountComponentAtNode(div);
});
