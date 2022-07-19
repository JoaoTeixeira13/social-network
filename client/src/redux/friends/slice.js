// mini sub reducer that handles global state but only specific to the
//friends

//friends=[]: is a property inside global state, we're using default parameter here

export default function friendsWannabeesReducer(friends = [], action) {
    if (action.type === "friends-wannabees/receive") {
        friends = action.payload.friendsAndWannabees;
    }

    if (action.type === "friends-wannabees/accept") {
        
        friends = friends.map((friend) => {
            if (friend.id == action.payload.id) {
                return {
                    ...friend,
                    accepted: true,
                };
            } else {
                return friend;
            }
        });
    }
    if (action.type === "friends-wannabees/unfriend") {
        friends = friends.filter((friend) => {
            if (friend.id !== action.payload.id) {
                return friend;
            }
        });
    }

    return friends;
}
export function makeFriend(id) {
    return {
        type: "friends-wannabees/accept",
        payload: { id },
    };
}

export function makeUnfriend(id) {
    return {
        type: "friends-wannabees/unfriend",
        payload: { id },
    };
}

// create an action for receiveFriendsAndWannabees

export function receiveFriendsAndWannabees(friendsAndWannabees) {
    return {
        type: "friends-wannabees/receive",
        payload: { friendsAndWannabees },
    };
}


