import Chat from "./chat";
import OnlineUsers from "./onlineUsers";
import { useState } from "react";

export default function ChatWindow(props) {
    const [channel, setChannel] = useState(0);

    return (
        <div className="chatElement">
            <Chat userId={props.userId} channel={channel} />
            <OnlineUsers setChannel={setChannel} />
        </div>
    );
}
