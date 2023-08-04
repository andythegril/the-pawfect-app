import React, { useState } from 'react';
import axios from 'axios';

export default function ChatInput({ userPet, clickedUserPet, fetchChatMessages, fetchClickedUserChatMessages }) {
    const [messageInput, setMessageInput] = useState('');
    const userPetId = userPet?._id
    const clickedUserPetId = clickedUserPet?._id

    console.log( "userPetId", userPetId)
    console.log( "clickedUserPetId", clickedUserPetId)
    const handleSendMessage = async () => {
        const message = {
            timestamp: new Date().toISOString(),
            from_userId: userPetId,
            to_userId: clickedUserPetId,
            content: messageInput
        }
        try {
            await axios.post('/message', message );
            fetchChatMessages();
            fetchClickedUserChatMessages();
            setMessageInput("")
        } catch (error) {
            console.error('Error sending chat message:', error);
        }
    };

    return (
        <div className="flex mt-32">
            <input
                type="text"
                placeholder="say something..."
                value={messageInput}
                style={{width: "30%"}}
                onChange={(e) => setMessageInput(e.target.value)}
            />
            <button className="bg-gray-500 hover:bg-primary m-2 px-4 py-2 rounded-2xl text-white" onClick={handleSendMessage}>Send</button>
        </div>
    );
}
