import React, { Component } from 'react';
import ProducerForm from './components/producer/Producer';
import Consumer from './components/consumer/Consumer';
import Message from './components/message/Message';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      messageQueue: [],
      message: ''
    }
  }

  updateQueue = () => {
    fetch('http://localhost:3000/display_messages', {
      method: 'get',
      headers: {'Content-Type': 'application/json'}
    })
    .then((res) => res.json())
    .then((response) => {
      let pointer = response.head;
      let data = [];
      while (pointer !== null) {
        data.push(<li key={pointer.id}><Message message={pointer.message} id={pointer.id} /></li>);
        pointer = pointer.next;
      }
      this.setState({messageQueue: data}, () => {
        return this.state.messageQueue;
      })
    })
  }

  onInputChange = (event) => {
    this.setState({message: event.target.value});
  }

  handleProducer = () => {
    fetch('http://localhost:3000/new_message', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        message: this.state.message
      })
    })
    .then(() => {
        this.updateQueue();
    })
    
  }

  handleConsumer = () => {
    fetch('http://localhost:3000/consume_message', {
      method: 'delete',
      headers: {'Content-Type': 'application/json'}
    }).then(() => {
      this.updateQueue();
    })
  }

  render() {
    this.updateQueue();
    return (
      <div className="App">
        <div className="messageQueue">
          <h1>WonderQ</h1>
          <p>Front</p>
          <ul>
            {this.state.messageQueue}
          </ul>
          <p>Back</p>
        </div>
        <div className="buttonsContainer">
          <ProducerForm handleProducer={this.handleProducer} onInputChange={this.onInputChange}/>
          <Consumer handleConsumer={this.handleConsumer} />
        </div>
      </div>
    );
  }
}

export default App;
