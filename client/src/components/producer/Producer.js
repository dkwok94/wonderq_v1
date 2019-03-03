import React from 'react';

const ProducerForm = ({ handleProducer, onInputChange }) => {
    return (
        <div className="producerForm">
            <input className="messageInput" type="text" name="message" onChange={onInputChange}></input>
            <button className="generateMessage" type="button" onClick={handleProducer}>Generate Message</button>
        </div>
    );
}

export default ProducerForm;