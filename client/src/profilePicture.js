export default function ProfilePicture({ first, last, imageUrl }) {
    console.log("props info being passed down App: ", imageUrl);

    imageUrl = imageUrl || "/default.png";

    return (
        <div>
            <h2>
                This is the profile picture component. My name is {first} and my
                last name is {last}.
            </h2>
            <img src={imageUrl} alt="my pic" />
        </div>
    );
}
