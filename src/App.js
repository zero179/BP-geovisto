import React, { Component,Fragment } from 'react';
import Navbar from './components/Navbar/Navbar'
import './App.css';
import Foot from './components/Footer/Footer'

class App extends Component {
  render() {
    return (
      <>
        <Navbar />
        <Foot/>
      </>
    );
  }
}

export default App;