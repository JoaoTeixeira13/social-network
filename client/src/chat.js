import { useSelector } from "react-redux";
import { socket } from "./socket";
import { useEffect, useRef } from "react";

export default function Chat() {
    const messages = useSelector((state) => state.messages);
    const chatContainerRef = useRef();
    useEffect(() => {
        console.log("chat just mounted");
        chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight -
            chatContainerRef.current.clientHeight;
    }, [messages]);
    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();

            socket.emit("new-message", e.target.value);
            e.target.value = "";
        }
    };
    return (
        <>
            <h1 className="chatHeader">Welcome to Chat</h1>

            <div className="chat-display-container" ref={chatContainerRef}>
                {messages &&
                    messages.map((message) => {
                        return (
                            <div className="chatCell" key={message.id}>
                                <img
                                    className="chatIcon"
                                    src={message.imageurl || "/default.png"}
                                    alt={`${message.first} ${message.last}`}
                                />
                                <p>
                                    <strong>
                                        {message.first} {message.last}{" "}
                                    </strong>
                                    says: {message.message}
                                </p>
                            </div>
                        );
                    })}
            </div>
            <textarea
                onKeyDown={keyCheck}
                placeholder="Chime in and type girl"
            ></textarea>
        </>
    );
}
