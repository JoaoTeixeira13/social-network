import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";

export default function OtherProfile() {
    const [user, setUser] = useState({});
    const { otherUserId } = useParams();
    const history = useHistory();

    useEffect(() => {
        let abort = false;
        if (!abort) {
            fetch(`/api/user/${otherUserId}`)
                .then((resp) => resp.json())
                .then((data) => {
                    if (data.ownProfile) {
                        history.push("/");
                    } else if (data.noMatch) {
                        setUser(false);
                    } else {
                        setUser(data.profile);
                    }
                })
                .catch((err) => {
                    console.log("error is ", err);
                });
        }
        return () => {
            abort = true;
        };
    }, []);
    return (
        <>
            {!user && (
                <div>
                    {" "}
                    <h1>404 NO USER FOUND</h1>
                </div>
            )}
            {user && (
                <div>
                    <h1>Other Witches, Writers and WebDevs!</h1>
                    <h2>
                        {user.first} {user.last}
                    </h2>
                    <img
                        src={user.imageurl}
                        alt={`${user.first} ${user.last}`}
                    />
                    <h3>{user.bio}</h3>
                </div>
            )}
        </>
    );
}
