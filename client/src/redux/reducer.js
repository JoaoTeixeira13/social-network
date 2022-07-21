import { combineReducers } from "redux";
import friendsWannabeesReducer from "./friends/slice";
import messagesReducer from "./messages/slice";

const rootReducer = combineReducers({
    friends: friendsWannabeesReducer,
    messages: messagesReducer,
});

export default rootReducer;
