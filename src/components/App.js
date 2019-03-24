import React, { Component } from 'react';
import './App.css';
import Header from '../shared/components/layout/Header';
import Footer from '../shared/components/layout/Footer';
import Content from '../shared/components/layout/Content';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import ArticleFeed from './ArticleFeed/ArticleFeed';
import Game from './Game/Game';
import LiveMatch from './LiveMatch/LiveMatch';
import Post from './Post/Post';
import Compose from './Compose/Compose';
import Success from './Success/Success';
import sc2 from "steemconnect";

class App extends Component {
  constructor(props) {
    super(props);
    let api = sc2.Initialize({
      app: 'SteemChess',
      callbackURL: 'https://localhost:3000/Success',
      accessToken: 'access_token',
      scope: ['vote', 'comment']
    });

    this.state = {
      api: api
    };
  }
  render() {
    return (
      <Router>
      <div className="App">
        <Header />

        <Content>
          <Route path='/' render={(props) => <ArticleFeed {...props} limit={'10'} sortMethod={'trending'}/>} exact />
          <Route path='/Hot' render={(props) => <ArticleFeed {...props} limit={'10'} sortMethod={'hot'}/>} exact />
          <Route path='/New' render={(props) => <ArticleFeed {...props} limit={'10'} sortMethod={'created'}/>} exact />
          <Route path='/Play' component={Game} exact /> 
          <Route path='/Live' component={LiveMatch} exact />
          <Route path='/Post/@:author/:permlink' component={Post} exact />
          <Route path='/Compose' component={Compose} exact />
          <Route path='/Success' render={(props) => <Success {...props} api={this.state.api}/>}/>
        </Content>

        <Footer />
      </div>
      </Router>
      
    );
  }
}

export default App;