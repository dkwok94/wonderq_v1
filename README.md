# WonderQ

# About
WonderQ is a simple message queue service. It was designed as a singly linked list which would provide O(1) for insertion and removal via a head and tail pointer. I was not able to implement a database for data persistence, so every time the server is restarted, the linked list instance will be reset. However, within a single session, you can create messages and consume them. I have provided a front-end React application to view the state of the queue.

# Technologies
* NodeJS 11.9.0
* Express 4.16.4
* React 16.8.3

# Installation
In order to install the software, `cd` into the `server` directory and run `npm i`. This will install all of the dependencies for the server. Do the same thing for the `client` directory which will install all of the dependencies for the React application.  
  
After doing this, start two separate terminals. `cd` into each directory and run `npm start` on each. Run the React front end on `localhost:3001` in a browser and you'll be able to see the queue and generate/consume messages from it.

# API Endpoints
## GET
```http://localhost:3000/display_messages```  
This endpoint routes to a function that takes the request, the response, and the messageQueue instance as arguments. It takes the locally stored messageQueue and passes back a response containing the JSON of the of the singly-linked list, containing the `head`, `tail`, and `next` pointers and a 200 status code.  
### Example Response
When the linked list is empty
```
{
    "head": null,
    "tail": null,
    "length": 0
}
```  

When the linked list has nodes  
```
{
    "head": {
        "id": 1551598228986,
        "status": "pending",
        "message": "sudo apt-get install python3-pip",
        "next": {
            "id": 1551598254112,
            "status": "pending",
            "message": "sudo apt update",
            "next": null
        }
    },
    "tail": {
        "id": 1551598254112,
        "status": "pending",
        "message": "sudo apt update",
        "next": null
    },
    "length": 2
}
```

## POST
```http://localhost:3000/new_message```  
This endpoint routes to a function that handles the creation of a new message. The request, response, and local messageQueue are passed in and the `insert` method of the messageQueue is called which asynchronously inserts a message at the back of the queue. The endpoint returns a response containing the message ID of the newly created message with a 200 status code for success. If there are errors in insertion, it returns a 404 status code and information on what was returned from the called function. 

### Example Response  
Assuming an empty linked list, after calling this endpoint:  
```
"1551598462062"
```  
Calling the `/display_messages` endpoint shows this:  
```
{
    "head": {
        "id": 1551598462062,
        "status": "pending",
        "message": "sudo apt-get install python-pip",
        "next": null
    },
    "tail": {
        "id": 1551598462062,
        "status": "pending",
        "message": "sudo apt-get install python-pip",
        "next": null
    },
    "length": 1
}
```  

For a failure:
```
"Received undefined from function"
```

## DELETE
```/consume_messsage```  
This endpoint routes to a function that consumes the message at the front of the queue. It passes the request, response, and local messageQueue and calls the `remove` function of the messageQueue class. This function takes the node at the front of the linked list, disconnects it from the list, and runs the message (ie. console.log the message). It returns a response signifying the message ID being fulfilled with a 200 status code. Any failures in removing the message from the queue, or with an empty queue returns a 404 status and a response signifying that the queue might be empty. 

### Example Response  
When this endpoint is run, the following is send to the response body:  
```
Message ID: 1551598462062 has been fulfilled
```  

When the queue is empty:  
```
Could not remove message from queue (queue might be empty)
```

# Scalability
Since the task was relatively simple, I decided to take the opportunity to code my own message queue. This would definitely not suffice if the number of users were to multiply.  
  
In these cases, I would probably have a cluster of designated web servers containing the application logic and API so that there would be multiple that could process messages and push them onto the queue. A load balancer like Haproxy would be used to more efficiently route all of the incoming requests to the servers that are more free. To increase redundancy around the load balancer to prevent single points of failure, I would have a backup load balancer in an active:passive configuration so that if the load balancer fails, the passive copy will take on the load.
  
There would be one single server containing the messageQueue itself so that thousands of requests can be stored on the queue in the server. This server would be directly connected to the data store like Redis which would be used to persist all messages in a memcache which makes for extremely fast reads. This would be where the queue checks for updates. To increase redundancy, I would want to have a replica of this data store. 
  
I would also have a horizontally scaled cluster of servers that would have the ability to spawn multiple workers to constantly check the queue process the requests on the messageQueue concurrently, making for increased efficiency.