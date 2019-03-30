import React, {Component} from 'react';
import './App.css';
import Header from '../shared/components/layout/Header';
import Footer from '../shared/components/layout/Footer';
import Content from '../shared/components/layout/Content';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import ArticleFeed from './ArticleFeed/ArticleFeed';
import LiveMatch from './LiveMatch/LiveMatch';
import Post from './Post/Post';
import Compose from './Compose/Compose';
import Play from './Play/Play';
import Login from "../shared/components/Login/Login";

class App extends Component {

    render() {
        return (
            <Router>
                <div className="App">
                    <Header/>
                    <p>{this.state.access_token}</p>
                    <Content>
                        <Route path='/'
                               render={(props) => <ArticleFeed {...props} limit={'10'} sortMethod={'trending'}/>}
                               exact/>
                        <Route path='/Hot' render={(props) => <ArticleFeed {...props} limit={'10'} sortMethod={'hot'}/>}
                               exact/>
                        <Route path='/New'
                               render={(props) => <ArticleFeed {...props} limit={'10'} sortMethod={'created'}/>} exact/>
                        <Route path='/Play' render={(props) => <Play {...props} getAccessToken={this.getAccessToken}/>}
                               exact/>
                        <Route path='/Live'
                               render={(props) => <LiveMatch {...props} getAccessToken={this.getAccessToken}/>} exact/>
                        <Route path='/Post/@:author/:permlink' component={Post} exact/>
                        <Route path='/Compose' component={Compose} exact/>

                        <Route path='/Login' component={Login} exact/>

                    </Content>

                    <Footer/>
                </div>
            </Router>

        );
    }
}

export default App;