import React from 'react';

const Message = ({message, id}) => {
    return (
        <div className='message'>
            <p className='messageId'>Message ID: {id}</p>
            <p className='messageBody'>{message}</p>
        </div>
    );
}

export default Message;