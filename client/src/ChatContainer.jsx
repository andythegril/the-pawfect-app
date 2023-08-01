import ChatHeader from "./ChatHeader.jsx";
import MatchesDisplay from "./MatchesDisplay.jsx";
import ChatDisplay from "./ChatDisplay.jsx";
import {useEffect, useState} from "react";
import axios from "axios";

export default function ChatContainer() {


    return (
        <div className="z-1 text-left max-w-3xl max-h-full">
            <ChatHeader/>
            <div className="flex justify-around">
                <button className="bg-primary m-2 px-4 py-2 rounded-2xl text-white">Matches</button>
                <button className="bg-primary m-2 px-4 py-2 rounded-2xl text-white">Chat</button>
            </div>

            <MatchesDisplay/>
            <ChatDisplay/>

        </div>
    )
}