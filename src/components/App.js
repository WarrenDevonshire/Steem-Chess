import React, { Component } from 'react';
import './App.css';
import Header from '../shared/components/layout/Header';
import Footer from '../shared/components/layout/Footer';
import Content from '../shared/components/layout/Content';
import ChessGame from './ChessGame/ChessGame'
class App extends Component {
  render() {
    return (
      <div className="App">
        <Header title="Welcome to Steem-Chess" />
        <ChessGame/>
        <Content>
          <h1>This is a test.</h1>
        </Content>

        <Footer />
      </div>
    );
  }
}

export default App;
