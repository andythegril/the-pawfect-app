import {useState} from "react";
export default function ChatInput() {
    const [textArea, setTextArea] = useState()
    return (
        <div className="flex flex-col">
            <textarea
                name=""
                className="resize-none"
                placeholder="say something..."
                value={textArea} onChange={(e) => setTextArea(e.target.value)}/>
            <button className="bg-primary m-4 px-4 py-2 rounded-2xl text-white">Send</button>
        </div>
    )
}