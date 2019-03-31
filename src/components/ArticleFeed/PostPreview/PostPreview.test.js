import React from 'react';
import ReactDOM from 'react-dom';
import PostPreview from './PostPreview';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PostPreview />, div);
  ReactDOM.unmountComponentAtNode(div);
});