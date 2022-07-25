import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveFriendsAndWannabees } from "./redux/friends/slice";

export default function Friends(props) {
    const dispatch = useDispatch();
    const friends = useSelector((state) =>
        state.friends.filter((friend) => friend.accepted)
    );

    useEffect(() => {
        (async () => {
            try {
                const resp = await fetch(`/friendsWannabees?id=${props.id}`);
                const data = await resp.json();
                if (data.success) {
                    dispatch(
                        receiveFriendsAndWannabees(data.friendsAndPretenders)
                    );
                }
            } catch (err) {
                console.log("error in posting users' relationship ", err);
            }
        })();
    }, []);
    return (
        <div className="friendWrapper">
            <h1>Friends</h1>
            <div className="friendDisplay">
                {friends.length === 0 && <h2>No friends yet!</h2>}
                {friends &&
                    friends.map((friend) => {
                        return (
                            <div className="userCell" key={friend.id}>
                                <img
                                    src={friend.imageurl || "/default.png"}
                                    alt={`${friend.first} ${friend.last}`}
                                />
                                <h4>{friend.first}</h4>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
