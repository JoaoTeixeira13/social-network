import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
    makeUnfriend,
    makeFriend,
    receiveFriendsAndWannabees,
} from "./redux/friends/slice";

export default function FriendsAndWannabees() {
    const dispatch = useDispatch();
    const wannabees = useSelector((state) =>
        state.friends.filter((friend) => !friend.accepted)
    );
    const friends = useSelector((state) =>
        state.friends.filter((friend) => friend.accepted)
    );


    useEffect(() => {

        (async () => {
            try {
                const resp = await fetch("/friendsWannabees");
                const data = await resp.json();

                dispatch(receiveFriendsAndWannabees(data.friendsAndPretenders));
            } catch (err) {
                console.log("error in posting users' relationship ", err);
            }
        })();
    }, []);

    const handleClick = (id, type) => {
        (async () => {
            try {
                const resp = await fetch(`/api/requestHandle/${id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ buttonText: type }),
                });
                const data = await resp.json();
                console.log("received data back is,", data);

                if (!data.error) {
                    if (type === "Accept Friend Request") {
                        dispatch(makeFriend(id));
                    }
                    if (type === "Unfriend") {
                        dispatch(makeUnfriend(id));
                    }
                }
            } catch (err) {
                console.log("error in posting users' relationship ", err);
            }
        })();
    };
    return (
        <section>
            <h1>Friends</h1>
            <div className="friends">
                {friends &&
                    friends.map((friend) => {
                        return (
                            <div key={friend.id}>
                                <img
                                    src={friend.imageurl || "/default.png"}
                                    alt={`${friend.first} ${friend.last}`}
                                />
                                <h2>
                                    {friend.first} {friend.last}
                                </h2>
                                <button
                                    onClick={() =>
                                        handleClick(friend.id, "Unfriend")
                                    }
                                >
                                    Unfriend
                                </button>
                            </div>
                        );
                    })}
            </div>
            <h1>Wannabees</h1>

            <div className="wannabees">
                {wannabees &&
                    wannabees.map((wannabee) => {
                        return (
                            <div key={wannabee.id}>
                                <img
                                    src={wannabee.imageurl || "/default.png"}
                                    alt={`${wannabee.first} ${wannabee.last}`}
                                />
                                <h2>
                                    {wannabee.first} {wannabee.last}
                                </h2>
                                <button
                                    onClick={() =>
                                        handleClick(
                                            wannabee.id,
                                            "Accept Friend Request"
                                        )
                                    }
                                >
                                    Accept Friend Request
                                </button>
                            </div>
                        );
                    })}
            </div>
        </section>
    );
}
