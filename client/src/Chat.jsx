import React from 'react';


export default function Chat({ descOrderMessages}) {
    return (
        <div className="chat-display">
            {descOrderMessages.map((message, _index) => {
                return (
                    <div key={_index}>
                        <div className="flex mt-2 chat-message-header">
                            <div className="flex">
                                <img
                                    className="ml-2 w-10 h-10 rounded-full border border-primary"
                                    src={`http://localhost:4000/uploads/${message.photos}`}
                                    alt={message.name + ' profile'}
                                />
                            </div>
                            <p className="m-2 text-primary font-bold">{message.name}</p>
                        </div>
                        <p className="m-2 align-middle">{message.content}</p>
                    </div>
                );
            })}
        </div>
    );
}
