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

// Updates the messageQueue in the state of the application
  updateQueue = () => {
    fetch('http://localhost:3000/display_messages', {
      method: 'get',
      headers: {'Content-Type': 'application/json'}
    })
    .then((res) => res.json())
    .then((response) => {

      // Fills an array with separate list HTML tags to render
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

  // Grabs the textbox input
  onInputChange = (event) => {
    this.setState({message: event.target.value});
  }

  // Handles the creation of messages through the API, sends the message in the request body, and updates the queue state
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

  // Handles the consumption of the first message in the queue and updates the queue state
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
