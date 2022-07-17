import { useState, useEffect } from "react";

export default function FriendButton({ viewedUser }) {
    const [buttonText, setButtonText] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const resp = await fetch(`/api/relation/${viewedUser}`);
                const data = await resp.json();

                setButtonText(data.buttonText);
            } catch (err) {
                console.log("error in fetching users' relationship ", err);
            }
        })();
    }, []);

    const handleFriendship = () => {
        (async () => {
            const resp = await fetch(`/api/requestHandle/${viewedUser}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ buttonText }),
            });
            const data = await resp.json();
            setButtonText(data.buttonText);

            try {
            } catch (err) {
                console.log("error in posting users' relationship ", err);
            }
        })();
    };
   
    return (
        <>
            {" "}
            <button onClick={() => handleFriendship()}> {buttonText}</button>
        </>
    );
}
