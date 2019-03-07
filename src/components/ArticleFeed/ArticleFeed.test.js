import React from 'react';
import ReactDOM from 'react-dom';
import ArticleFeed from './ArticleFeed';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ArticleFeed />, div);
  ReactDOM.unmountComponentAtNode(div);
});