import React, { Component } from 'react';
import './App.css';
import Header from '../shared/components/layout/Header';
import Footer from '../shared/components/layout/Footer';
import Content from '../shared/components/layout/Content';
<<<<<<< HEAD
import List from './List/List';
import Menubar from '../shared/components/Menu/Menubar'
=======
>>>>>>> develop

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header title="Welcome to Steem-Chess" />

        <Content>
<<<<<<< HEAD
          <Menubar/>
          <Home />
=======
          <h1>This is a test.</h1>
>>>>>>> develop
        </Content>

        <Footer />
      </div>
    );
  }
}

export default App;
