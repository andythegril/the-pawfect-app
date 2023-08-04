import React, { useState, useEffect } from 'react';
import Chat from './Chat.jsx';
import ChatInput from './ChatInput.jsx';
import axios from 'axios';

export default function ChatDisplay({ userPet, clickedUserPet }) {

    const userPetId = userPet?._id
    const clickedUserPetId = clickedUserPet?._id

    // console.log( "userPet", userPet)
    // console.log( "clickedUserPet", clickedUserPet)

    const [messages, setMessages] = useState([]);
    const [clickedUserMessages, setClickedUserMessages] = useState(null)

    // Function to fetch chat messages between the current user and the clicked user
    const fetchChatMessages = async () => {
        try {
            const response = await axios.get('/messages', {
                params: {
                    userPetId: userPetId,
                    clickedUserPetId: clickedUserPetId,
                },
            });
            // console.log('API response userPet ',response.data);
            setMessages(response.data);

        } catch (error) {
            console.error('Error fetching chat messages:', error);
        }
    };

    const fetchClickedUserChatMessages = async () => {
        try {
            const response = await axios.get('/messages', {
                params: {
                    userPetId: clickedUserPetId,
                    clickedUserPetId: userPetId,
                },
            });
            // console.log('API response clickedUser ',response.data);
            setClickedUserMessages(response.data);


        } catch (error) {
            console.error('Error fetching chat messages:', error);
        }
    };


    useEffect(() => {
        if (clickedUserPetId) {
            Promise.all([fetchChatMessages(), fetchClickedUserChatMessages()]).then(() => {
                // Both sets of messages have been fetched
            }).catch((error) => {
                console.error('Error fetching chat messages:', error);
            });
        }
    }, [clickedUserPetId]);


    const chatMessages = []

    messages?.forEach(message => {
        const formatMsg = {}
        formatMsg['name'] = userPet?.name
        formatMsg['photos'] = userPet?.photos[0]
        formatMsg['content'] = message.content
        formatMsg['timestamp'] = message.timestamp
        chatMessages.push(formatMsg)
    })

    clickedUserMessages?.forEach(message => {
        const formatMsg = {}
        formatMsg['name'] = clickedUserPet?.name
        formatMsg['photos'] = clickedUserPet?.photos[0]
        formatMsg['content'] = message.content
        formatMsg['timestamp'] = message.timestamp
        chatMessages.push(formatMsg)
    })


    const descOrderMessages = chatMessages?.sort((a,b) => a.timestamp.localeCompare(b.timestamp))

    return (
        <div>
            <Chat descOrderMessages={descOrderMessages}  />
            <ChatInput userPet={userPet} clickedUserPet={clickedUserPet} fetchChatMessages={fetchChatMessages} fetchClickedUserChatMessages={fetchClickedUserChatMessages}    />
        </div>
    );
}
