import { combineReducers } from "redux";
import friendsWannabeesReducer from "./friends/slice";
import messagesReducer from "./messages/slice";
import onlineReducer from "./online/slice";

const rootReducer = combineReducers({
    friends: friendsWannabeesReducer,
    messages: messagesReducer,
    onlineUsers: onlineReducer,
});

export default rootReducer;
