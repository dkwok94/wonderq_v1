const handleNewMessage = (req, res, messageQueue) => {
    const { message } = req.body;
    console.log(message);
    messageQueue.insert(message).then((newMessage) => {
        console.log(`inserted new message ${newMessage.id} into queue`);
        res.status(200).json(newMessage.id.toString());
    }).catch((err) => {
        console.log(`Received ${err} from function`);
        res.status(404).send("Cannot insert message into queue");
    });
};

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
    console.log(count);
    messageQueue.remove().then((consumed) => {
        consumed.status = 'processing';

        // Mimic running the message from the queue
        console.log(consumed.message);
        consumed.status = 'complete';
        res.status(200).send(`Message ID: ${consumed.id} has been fulfilled`);
    }).catch((err) => {
        console.log(`Received ${err} from function`);
        res.status(404).send("Could not remove message from queue (queue might be empty)")
    });
};

const handleDisplayMessages = (req, res, messageQueue) => {
    res.json(messageQueue);
    
};

module.exports = {
    handleNewMessage,
    handleConsumeMessage,
    handleDisplayMessages
}