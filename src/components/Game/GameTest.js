import React from 'react';
import ReactDOM from 'react-dom';
import CreateGame from './CreateGame';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CreateGame />, div);
  ReactDOM.unmountComponentAtNode(div);
});
