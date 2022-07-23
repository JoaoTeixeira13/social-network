import { io } from "socket.io-client";
import { messagesReceived, addNewMessage } from "./redux/messages/slice";
import { usersOnline } from "./redux/online/slice";

export let socket;

export const init = (store) => {
    if (!socket) {
        //only establish a socket connection once
        socket = io.connect();

        socket.on("last-10-messages", (msgs) => {
            store.dispatch(messagesReceived(msgs.messages));
        });

        socket.on("add-new-message", (msg) => {
            store.dispatch(addNewMessage(msg));
        });

        socket.on("online-users", (onlineUsers) => {
            store.dispatch(usersOnline(onlineUsers));
        });
    }

    return socket;
};
