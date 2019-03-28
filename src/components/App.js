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
      scope: ['login', 'comment_options','vote', 'comment']
    });

    this.onAccessToken = this.onAccessToken.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getAPI = this.getAPI.bind(this);
    this.state = {
      api: api,
      access_token: null
    };
  }

  getAPI(){
    return this.state.api;
  }

  async onAccessToken(token) {
    this.setState(() => {
      return {access_token: token};
    });
    this.state.api.setAccessToken(token);
  }
  componentDidMount() {
  }

  getAccessToken() {
    return this.state.access_token;
  }

  render() {
    return (
      <Router>
      <div className="App">
        <Header />
        <p>{this.state.access_token}</p>
        <Content>
          <Route path='/' render={(props) => <ArticleFeed {...props} limit={'10'} sortMethod={'trending'}/>} exact />
          <Route path='/Hot' render={(props) => <ArticleFeed {...props} limit={'10'} sortMethod={'hot'}/>} exact />
          <Route path='/New' render={(props) => <ArticleFeed {...props} limit={'10'} sortMethod={'created'}/>} exact />
          <Route path='/Play' render={(props) => <Game {...props} getAccessToken={this.getAccessToken}/>} exact/>
          <Route path='/Live' render={(props) => <LiveMatch {...props} getAccessToken={this.getAccessToken}/>} exact/>
          <Route path='/Post/@:author/:permlink' render={(props) => <Post {...props} getAccessToken={this.getAccessToken} getAPI={this.getAPI}/>} exact />
          <Route path='/Compose' component={Compose} exact />
          <Route path='/Success'
                 render={(props) => <Success {...props} api={this.state.api} onAccessToken={this.onAccessToken} getAPI={this.getAPI}/>}/>
        </Content>

        <Footer />
      </div>
      </Router>
      
    );
  }
}

export default App;