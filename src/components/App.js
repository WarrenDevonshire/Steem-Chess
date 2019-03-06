import React, { Component } from 'react';
import './App.css';
import Header from '../shared/components/layout/Header';
import Footer from '../shared/components/layout/Footer';
import Content from '../shared/components/layout/Content';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import ArticleFeed from './ArticleFeed/ArticleFeed';
import CreateGame from './Create Game/CreateGame';

class App extends Component {
  render() {
    return (
      <Router>
      <div className="App">
        <Header />
        <Content>
        <Route path="/" component={ArticleFeed} exact />
        <Route path="/Hot" component={ArticleFeed} exact />
        <Route path="/New" component={ArticleFeed} exact />
        <Route path="/Play" component={CreateGame} exact/>
          
        </Content>

        <Footer />
      </div>
      </Router>
      
    );
  }
}

export default App;