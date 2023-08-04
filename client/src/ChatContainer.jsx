import React, { useEffect, useState } from 'react';
import MatchesDisplay from './MatchesDisplay';
import ChatDisplay from './ChatDisplay';
import axios from "axios";


export default function ChatContainer({ matches, userPet}) {

    const [clickedUser, setClickedUser] = useState(null);
    console.log("matchedPets from parent component", matches)


    return (
        <div>
            {userPet && (
                <div className="ml-2 flex flex-col w-40 h-40 justify-around items-center">
                    <h3 className="text-primary font-bold">{userPet.name}</h3>
                    {userPet.photos && userPet.photos.length > 0 && (
                        <img className="rounded-2xl" src={`http://localhost:4000/uploads/${userPet.photos[0]}`} alt={userPet.name} />
                    )}
                </div>
            )}
            <div className="flex ">
                <button
                    className="bg-primary border-transparent border-b-4 hover:border-black m-2 px-4 py-2 rounded-2xl text-white"
                    onClick={() => setClickedUser(null)}
                >
                    Matches
                </button>
                <button
                    className="bg-primary border-transparent border-b-4 hover:border-black m-2 px-4 py-2 rounded-2xl text-white"
                    disabled={!clickedUser}
                >
                    Chat
                </button>
            </div>
            {!clickedUser && <MatchesDisplay matches={matches} setClickedUser={setClickedUser} />}
            {clickedUser &&  <ChatDisplay userPet={userPet} clickedUserPet={clickedUser} />}
        </div>
    );
}
