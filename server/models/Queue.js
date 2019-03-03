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

    // Pushes a message to the end of the linked list
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

    // Removes a message from the beginning of the queue
    shift(){
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

    // Removes a message from the tail of the queue
    pop(){
        if(!this.head) {
            reject(undefined);
        }
        var current = this.head;
        var newTail = current;
        while(current.next){
            newTail = current;
            current = current.next;
        }
        this.tail = newTail;
        this.tail.next = null;
        this.length--;
        if(this.length === 0){
            this.head = null;
            this.tail = null;
        }
        resolve(current);
    }

    // Returns the message at a specific index of the queue
    get(index) {
        return new Promise((resolve, reject) => {
            if(index < 0 || index >= this.length) {
                reject(undefined);
            }
            var counter = 0;
            var current = this.head;
            while(counter !== index){
                current = current.next;
                counter++;
            }
            resolve(current);
        }) 
    }

    inser(index, val){
        if(index < 0 || index > this.length) return false;
        if(index === this.length) return !!this.push(val);
        if(index === 0) return !!this.unshift(val);
        
        var newMessage = new Message(val);
        var prev = this.get(index - 1);
        var temp = prev.next;
        prev.next = newMessage;
        newMessage.next = temp;
        this.length++;
        return true;
    }

    remov(index) {
        return new Promise ((resolve, reject) => {
            if(index < 0 || index >= this.length) {
                reject(undefined);
            } else if(index === 0) {
                removed = this.shift().then((removed) => {
                    return removed;
                });
            } else if(index === this.length - 1) {
                removed = this.pop().then((removed) => {
                    return removed;
                });
            } else {
                var previousMessage = this.get(index - 1).then((current) => {
                    return current;
                });
                var removed = previousMessage.next;
                previousMessage.next = removed.next;
                this.length--;
            }
            resolve(removed);
        })
    }
}

module.exports = {
    Message,
    MessageQueue
};
