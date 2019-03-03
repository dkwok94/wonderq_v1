// Handles the creation of new messages
const handleNewMessage = (req, res, messageQueue) => {
    const { message } = req.body;

    // Call the insert promise from the messageQueue class
    messageQueue.insert(message).then((newMessage) => {
        console.log(`inserted new message ${newMessage.id} into queue`);

        // Returns a 200 status code and the message ID of the newly created message
        res.status(200).json(newMessage.id.toString());
    }).catch((err) => {
        console.log(`Received ${err} from function`);
        res.status(404).send("Cannot insert message into queue");
    });
};

// Handles the consumption of messages
const handleConsumeMessage = (req, res, messageQueue) => {
    // Find the first node that is not being consumed
    let count = 0;
    let head = messageQueue.head;
    while (head !== null) {
        if (head.status === "pending") {
            break
        } else {
            head = head.next;
            count++;
        }
    }

    // Calls the remove promise from the messageQueue class
    messageQueue.remove().then((consumed) => {
        consumed.status = 'processing';

        // Mimic running the message from the queue
        console.log(consumed.message);
        consumed.status = 'complete';

        // Returns a 200 success code and status of the consumed message
        res.status(200).send(`Message ID: ${consumed.id} has been fulfilled`);
    }).catch((err) => {
        console.log(`Received ${err} from function`);
        res.status(404).send("Could not remove message from queue (queue might be empty)")
    });
};

// Returns the messageQueue instance in the response in JSON format
const handleDisplayMessages = (req, res, messageQueue) => {
    res.json(messageQueue);
    
};

module.exports = {
    handleNewMessage,
    handleConsumeMessage,
    handleDisplayMessages
}