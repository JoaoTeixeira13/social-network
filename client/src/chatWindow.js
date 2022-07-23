import Chat from "./chat";
import OnlineUsers from "./onlineUsers";

export default function ChatWindow() {
    return (
        <div className="chatElement">
            <Chat />
            <OnlineUsers />
        </div>
    );
}
