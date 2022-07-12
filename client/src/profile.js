import ProfilePicture from "./profilePicture";
import Bio from "./bio";

export default function Profile(props) {
    console.log("props in Profile ", props);
    return (
        <div className="userProfile">
            <h1>This is the profile Component</h1>
            <h2> My name is {props.first}</h2>

            <ProfilePicture
                first={props.first}
                last={props.last}
                imageUrl={props.imageUrl}
            />
            <Bio bio={props.bio} setBio={(arg) => props.setBio(arg)} />
        </div>
    );
}