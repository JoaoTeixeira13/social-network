export default function messagesReducer(messages = [], action) {
    if (action.type === "messages/received") {
        messages = action.payload.messages.reverse();
    }
    if (action.type === "messages/new-message") {
        messages = [...messages, action.payload.message];
    }
    return messages;
}

//Action creators
export function messagesReceived(messages) {
    return {
        type: "messages/received",
        payload: { messages },
    };
}
export function addNewMessage(message) {
    return {
        type: "messages/new-message",
        payload: { message },
    };
}
