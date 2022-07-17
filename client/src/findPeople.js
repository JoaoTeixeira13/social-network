import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NotFound from "./404notFound";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        let abort = false;
        fetch(`/api/users?userSearch=${searchInput}`)
            .then((resp) => resp.json())
            .then((data) => {
                console.log("received data is,", data.payload);
                if (!abort) {
                    setUsers(data.payload);
                } else {
                    console.log("ignore input");
                }
            })
            .catch((err) => {
                console.log("error is ", err);
            });
        return () => {
            // this function runs, whenever there is another useEffect that gets
            // triggered after the initial one
            console.log("cleanup running");
            abort = true;
        };
    }, [searchInput]);

    return (
        <>
            <div className="findPeople">
                {(!searchInput && <h1>Newest users!</h1>) ||
                    (users.length !== 0 && searchInput && (
                        <h1>Results for {searchInput}</h1>
                    ))}
                {!users.length && <NotFound />}

                <div className="displayedUserSearch">
                    {users &&
                        users.map((user) => {
                            return (
                                <div key={user.id} className="userCell">
                                    <Link to={`user/${user.id}`}>
                                        <img
                                            src={user.imageurl || "/default.png"}
                                            alt={`${user.first} ${user.last}`}
                                        />{" "}
                                        <h3>
                                            {user.first} {user.last}
                                        </h3>
                                    </Link>
                                </div>
                            );
                        })}
                </div>
            </div>
            <div>
                <h3>Looking for someone else?</h3>
                <input
                    onChange={(e) => setSearchInput(e.target.value)}
                    name="userSearch"
                    type="text"
                    placeholder="Enter name"
                    value={searchInput}
                />
            </div>
        </>
    );
}
