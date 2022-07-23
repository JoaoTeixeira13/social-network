import { useSelector } from "react-redux";
import { useEffect } from "react";
import { socket } from "./socket";

export default function OnlineUsers() {
    const onlineUsers = useSelector((state) => state.onlineUsers);

    useEffect(() => {
        socket.emit("req-online-users");
    }, []);

    return (
        <>
            <div className="onlineUsers">
                <h3> Online users</h3>

                {onlineUsers &&
                    onlineUsers.map((user) => {
                        return (
                            <div className="chatCell" key={user.id}>
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
        </>
    );
}
