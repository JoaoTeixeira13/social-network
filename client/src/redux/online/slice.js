export default function onlineReducer(online = [], action) {
    if (action.type === "online/users") {
        online = action.payload.users;
    }

    return online;
}

//Action creators
export function usersOnline(users) {
    return {
        type: "online/users",
        payload: { users },
    };
}
