import { useState, useEffect } from "react";

export default function FindPeople() {
    const [newestUsers, setNewestUsers] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        let abort = false;
        fetch(`/users?userSearch=${searchInput}`)
            .then((resp) => resp.json())
            .then((data) => {
                if (!abort) {
                    setNewestUsers(data.payload);
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
        <div>
            {!searchInput && <h1>Newest users!</h1>}

            {newestUsers &&
                newestUsers.map((newestUser) => {
                    return (
                        <div key={newestUser.id}>
                            <img
                                src={newestUser.imageurl}
                                alt={(newestUser.first, newestUser.last)}
                            />{" "}
                            {newestUser.first} {newestUser.last}{" "}
                        </div>
                    );
                })}
            <p>Looking for someone else?</p>
            <input
                onChange={(e) => setSearchInput(e.target.value)}
                name="userSearch"
                type="text"
                placeholder="Enter name"
                value={searchInput}
            />
        </div>
    );
}
