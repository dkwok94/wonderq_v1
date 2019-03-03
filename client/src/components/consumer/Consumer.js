import React from 'react';

const Consumer = ({ handleConsumer }) => {
    return (
        <button className="consumeMessage" type="button" value="Consume Message" onClick={handleConsumer}>Consume Message</button>
    );
}

export default Consumer;