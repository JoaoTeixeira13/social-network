import Chat from "./chat";
import OnlineUsers from "./onlineUsers";
import { useState } from "react";

export default function ChatWindow() {
    const [channel, setChannel] = useState(0);

    return (
        <div className="chatElement">
            <Chat channel={channel} />
            <OnlineUsers setChannel={setChannel} />
        </div>
    );
}
