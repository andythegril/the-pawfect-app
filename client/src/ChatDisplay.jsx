import Chat from "./Chat.jsx";
import ChatInput from "./ChatInput.jsx";

export default function ChatDisplay() {
    return (
        <div className="flex flex-col">
            <Chat/>
            <ChatInput/>
        </div>
    )
}