import { useSelector } from "react-redux";
import { socket } from "./socket";
import { useEffect, useRef } from "react";

export default function Chat(props) {
    const messages = useSelector((state) => state.messages);
    const onlineUsers = useSelector((state) => state.onlineUsers);

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
    const filterMessages = (channel, messages, props) => {
        if (channel <= 0) {
            return messages;
        }
        const filtered = messages.filter(
            (message) =>
                message.sender_id == channel ||
                message.recipient_id == channel ||
                message.user_id == channel
        );

        //prevent messages to oneself from being duplicated
        const hash = {};

        const refiltered = filtered.filter(({ id, message }) => {
            const key = `${id}${message}`;

            if (key in hash) {
                return false;
            }

            hash[key] = true;

            return true;
        });
        return refiltered;
    };

    const displayRecipient = (channel) => {
        if (channel <= 0) {
            return false;
        }
        const user = onlineUsers.filter(
            (onlineUser) => onlineUser.id == channel
        );
        const userName = user[0].first;
        return userName;
    };

    return (
        <div className="chatArea">
            {(props.channel === props.userId && (
                <h2>Your space and personal notes</h2>
            )) ||
                (displayRecipient(props.channel) && (
                    <h2> Chatting with {displayRecipient(props.channel)}</h2>
                )) || <h2>Chat with everyone!</h2>}
            <div className="chat-display-container" ref={chatContainerRef}>
                {messages.length === 0 &&
                    ((props.channel === props.userId && (
                        <h2>
                            This is your space. You can save notes, links, or
                            talk to yourself if you wish.
                        </h2>
                    )) || (
                        <h2>
                            Start the conversation with{" "}
                            {displayRecipient(props.channel)}, you can type in
                            the box below.
                        </h2>
                    ))}
                {messages &&
                    filterMessages(props.channel, messages, props.user).map(
                        (message) => {
                            return (
                                <div className="chatCell" key={message.id}>
                                    <div className="imgContainer">
                                        <img
                                            className="chatIcon"
                                            src={
                                                message.imageurl ||
                                                "/default.png"
                                            }
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
                        }
                    )}
            </div>
            <textarea
                onKeyDown={keyCheck}
                placeholder="Chime in and type girl"
            ></textarea>
        </div>
    );
}
