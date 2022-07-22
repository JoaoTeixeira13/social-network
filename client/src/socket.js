import { io } from "socket.io-client";
import { messagesReceived, addNewMessage } from "./redux/messages/slice";

export let socket;

export const init = (store) => {
    if (!socket) {
        //only establish a socket connection once
        socket = io.connect();

        //error handling

        // socket.on("error", (err) => {
        //     console.log("socket error on client side: ", err);
        //     init(store);
        // });

        socket.on("last-10-messages", (msgs) => {
            store.dispatch(messagesReceived(msgs.messages));
        });

        socket.on("add-new-message", (msg) => {
            store.dispatch(addNewMessage(msg));
        });
    }

    return socket;
};
