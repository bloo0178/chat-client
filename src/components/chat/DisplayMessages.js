import React from 'react';

const DisplayMessages = (props) => {
    console.log(!props.messages[0]);
    if (!props.messages[0]) {
        return null;
    }
    return (
        <div className="Messages-Display">
            <ul>
                {props.messages.map((message, index) => {
                    return <li key={index}>{message.message}</li>
                })}
            </ul>
        </div>
    )
}

export default DisplayMessages;