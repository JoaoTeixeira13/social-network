import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { socket } from "./socket";

export default function OnlineUsers(props) {
    const onlineUsers = useSelector((state) => state.onlineUsers);
    const onlineContainerRef = useRef();
    useEffect(() => {
        onlineContainerRef.current.scrollTop =
            onlineContainerRef.current.scrollHeight -
            onlineContainerRef.current.clientHeight;
    }, [onlineUsers]);

    useEffect(() => {
        socket.emit("req-online-users");
    }, []);

    return (
        <>
            <div className="onlineUsers">
                <h2 onClick={() => props.setChannel(0)}>Open Chat Room</h2>
                <h2> Online users</h2>
                <div
                    className="chat-display-container"
                    ref={onlineContainerRef}
                >
                    {onlineUsers &&
                        onlineUsers.map((user) => {
                            return (
                                <div
                                    onClick={() => props.setChannel(user.id)}
                                    className="chatCell"
                                    key={user.id}
                                >
                                    <img
                                        className="chatIcon"
                                        src={user.imageurl || "/default.png"}
                                        alt={`${user.first} ${user.last}`}
                                    />
                                    <p>
                                        <strong>
                                            {user.first} {user.last}
                                        </strong>
                                    </p>
                                </div>
                            );
                        })}
                </div>
            </div>
        </>
    );
}
