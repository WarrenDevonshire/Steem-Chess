import React, { Component } from 'react';
import './App.css';
import Home from './Home/Home';
import Header from '../shared/components/layout/Header';
import Footer from '../shared/components/layout/Footer';
import Content from '../shared/components/layout/Content';
import List from './List/List';
import CreateGame from './Create Game/CreateGame';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header title="Welcome to Steem-Chess" />

        <Content>
          <CreateGame/>
        </Content>
        <List />

        <Footer />
      </div>
    );
  }
}

export default App;
