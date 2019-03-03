class Message {
    constructor(message) {
        this.id = Date.now();
        this.status = 'pending';
        this.message = message
        this.next = null;
    }
}

class MessageQueue {
    constructor () {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    // Removes the message at the head of the message queue
    // Input: none
    // Returns: the node that was removed message
    remove () {
        return new Promise ((resolve, reject) => {
            if(!this.head) {
                reject(undefined);
            }
            var currentHead = this.head;
            this.head = currentHead.next;
            this.length--;
            if (this.length === 0){
                this.tail = null;
            }
            resolve(currentHead);
        })
    }

    // Pushes a message to the end of the linked list queue
    // Input: message => the message contents
    // Returns: the newly created node message
    insert (message) {
        return new Promise ((resolve, reject) => {
            let newMessage = new Message(message);
            if (newMessage === null || newMessage === undefined) {
                reject(undefined);
            }
            if(!this.head) {
                this.head = newMessage;
                this.tail = this.head;
            } else {
                this.tail.next = newMessage;
                this.tail = newMessage;
            }
            this.length++;
            resolve(newMessage);
        })
    }
}

module.exports = {
    Message,
    MessageQueue
};
