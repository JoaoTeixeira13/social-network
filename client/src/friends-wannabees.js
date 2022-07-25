import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
    makeUnfriend,
    makeFriend,
    receiveFriendsAndWannabees,
} from "./redux/friends/slice";

export default function FriendsAndWannabees(props) {
    console.log("props in friends", props);
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
                const resp = await fetch(
                    `/friendsWannabees?id=${props.userId}`
                );
                const data = await resp.json();
                console.log("received data from friend and wannabees component is", data);

                dispatch(receiveFriendsAndWannabees(data.friendsAndPretenders));
            } catch (err) {
                console.log("error in posting users' relationship ", err);
            }
        })();
    }, []);

    const buttonValues = {
        add: "Add Friend",
        accept: "Accept Friend Request",
        cancel: "Cancel Friend Request",
        remove: "Unfriend",
    };

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
                    if (type === buttonValues.accept) {
                        dispatch(makeFriend(id));
                    }
                    if (type === buttonValues.remove) {
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
            <div className="fwWrapper">
                <div className="fwDisplay">
                    <h1>Friends</h1>
                </div>
                <div className="friends">
                    {friends &&
                        friends.map((friend) => {
                            return (
                                <div className="userCell" key={friend.id}>
                                    <img
                                        src={friend.imageurl || "/default.png"}
                                        alt={`${friend.first} ${friend.last}`}
                                    />
                                    <h4>
                                        {friend.first} {friend.last}
                                    </h4>
                                    <button
                                        onClick={() =>
                                            handleClick(
                                                friend.id,
                                                buttonValues.remove
                                            )
                                        }
                                    >
                                        Unfriend
                                    </button>
                                </div>
                            );
                        })}
                </div>
            </div>

            <div className="fwWrapper">
                <div className="fwDisplay">
                    <h1>Wannabees</h1>
                </div>
                <div className="wannabees">
                    {wannabees &&
                        wannabees.map((wannabee) => {
                            return (
                                <div className="userCell" key={wannabee.id}>
                                    <img
                                        src={
                                            wannabee.imageurl || "/default.png"
                                        }
                                        alt={`${wannabee.first} ${wannabee.last}`}
                                    />
                                    <h4>
                                        {wannabee.first} {wannabee.last}
                                    </h4>
                                    <div className="wannabeesButtons">
                                        <button
                                            onClick={() =>
                                                handleClick(
                                                    wannabee.id,
                                                    buttonValues.accept
                                                )
                                            }
                                        >
                                            ✅
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleClick(
                                                    wannabee.id,
                                                    buttonValues.remove
                                                )
                                            }
                                        >
                                            ✖️
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </section>
    );
}
