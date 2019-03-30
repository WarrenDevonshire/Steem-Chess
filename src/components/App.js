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

class App extends Component {
    constructor(props) {
        super(props);

    }


    render() {
        return (
            <Router>
                <div className="App">
                    <Header/>
                    <Content>
                        <Route path='/'
                               render={(props) => <ArticleFeed {...props} limit={'10'} sortMethod={'trending'}/>}
                               exact/>
                        <Route path='/Hot' render={(props) => <ArticleFeed {...props} limit={'10'} sortMethod={'hot'}/>}
                               exact/>
                        <Route path='/New'
                               render={(props) => <ArticleFeed {...props} limit={'10'} sortMethod={'created'}/>} exact/>
                        <Route path='/Play' render={(props) => <Play {...props} />} exact/>
                        <Route path='/Live' render={(props) => <LiveMatch {...props} />} exact/>
                        <Route path='/Post/@:author/:permlink' component={Post} exact/>
                        <Route path='/Compose' component={Compose} exact/>
                    </Content>
                    <Footer/>
                </div>
            </Router>

        );
    }
}

export default App;