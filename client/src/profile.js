import ProfilePicture from "./profilePicture";
import Bio from "./bio";

export default function Profile(props) {
    return (
        <div className="userProfile">
            <h2> Welcome to your profile, {props.first}!</h2>

            <ProfilePicture
                first={props.first}
                last={props.last}
                imageUrl={props.imageUrl}
                alt={`${props.first} ${props.last}`}
            />
            <Bio bio={props.bio} setBio={(arg) => props.setBio(arg)} />
        </div>
    );
}
