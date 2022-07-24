import { useSelector } from "react-redux";
import { socket } from "./socket";
import { useEffect, useRef } from "react";

export default function Chat(props) {
    console.log("props in chat are,", props);
    const messages = useSelector((state) => state.messages);
    const chatContainerRef = useRef();
    useEffect(() => {
        chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight -
            chatContainerRef.current.clientHeight;
    }, [messages]);
    useEffect(() => {
        socket.emit("fetch-messages", props.channel);
    }, [props.channel]);

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();

            socket.emit("new-message", e.target.value, props.channel);
            e.target.value = "";
        }
    };
    return (
        <div className="chatArea">
            <div className="chat-display-container" ref={chatContainerRef}>
                {messages &&
                    messages.map((message) => {
                        return (
                            <div className="chatCell" key={message.id}>
                                <div className="imgContainer">
                                    <img
                                        className="chatIcon"
                                        src={message.imageurl || "/default.png"}
                                        alt={`${message.first} ${message.last}`}
                                    />
                                </div>
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
        </div>
    );
}
