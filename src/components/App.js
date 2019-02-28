import React, { Component } from 'react';
import './App.css';
import Header from '../shared/components/layout/Header';
import Footer from '../shared/components/layout/Footer';
import Content from '../shared/components/layout/Content';
import Menubar from '../shared/components/Menu/Menubar'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header title="Welcome to Steem-Chess" />

        <Content>
          <Menubar/>
        </Content>

        <Footer />
      </div>
    );
  }
}

export default App;
