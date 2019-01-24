import React, { Component } from 'react';
import './App.css';
import {FileHandler, FileHandlerPU} from './FileHandler';

class App extends Component {
  constructor() {
    super();

    this.state = {
      uploadTarget: "Critical Impact"
    }
  }
  setTarget = (e) => {
    this.setState({
      uploadTarget: e.target.value
    });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">{this.state.uploadTarget} Drip Upload</h1>
        </header>
        <select onChange={this.setTarget}>
          <option value="Critical Impact">Critical Impcact</option>
          <option value="PostUp">PostUp</option>
        </select>
    { this.state.uploadTarget === "Critical Impact" ? <FileHandler /> : <FileHandlerPU /> }
      </div>
    );
  }
}

export default App;
