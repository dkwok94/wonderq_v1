const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// middleware
app.use(bodyParser.json());
app.use(cors());

// Initialize the queue, producer, and consumer classes
const { Message, MessageQueue } = require('./models/Queue');
// const { Producer } = require('./models/Producer');
// const { Consumer } = require('./models/Consumer');

// Create primary message queue, producer factory, and consumer instances
let messageQueue = new MessageQueue();
console.log(messageQueue);
// let producer = new Producer();
// let consumer = new Consumer();

// Get message handler functions
const message = require('./controllers/message');

app.get('/', (req, res) => {
    res.send('app running');
});

// Controller handlers
app.post('/new_message', (req, res) => {message.handleNewMessage(req, res, messageQueue);});
app.delete('/consume_message', (req, res) => {message.handleConsumeMessage(req, res, messageQueue);});
app.get('/display_messages', (req, res) => {message.handleDisplayMessages(req, res, messageQueue);});

// Start application on environment variable PORT or 3000
const PORT = process.env.PORT
app.listen(PORT || 3000, () => {
    console.log(`WonderQ listening on port ${PORT}`);
});