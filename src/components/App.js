import React, { Component } from 'react';
import './App.css';
import Header from '../shared/components/layout/Header';
import Footer from '../shared/components/layout/Footer';
import Content from '../shared/components/layout/Content';
import ChessGame from './ChessGame/ChessGame'
import CreateGame from './Create Game/CreateGame';
import ArticleFeed from './ArticleFeed/ArticleFeed';
import Post from '../components/Post/Post';


class App extends Component {
  render() {
    return (
      <div className="App">
      
        <Header title="Welcome to Steem-Chess" />
        <ChessGame/>
        <Content>
          <CreateGame/>
          <ArticleFeed />
          <Post />
        </Content>
        
        <Footer />
      </div>
    );
  }
}

export default App;
