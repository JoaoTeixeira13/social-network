import ProfilePicture from "./profilePicture";
import Bio from "./bio";
import Friends from "./friends";

export default function Profile(props) {
    return (
        <div className="userProfile">
            <div className="imageSection">
                <ProfilePicture
                    first={props.first}
                    last={props.last}
                    imageUrl={props.imageUrl || "/default.png"}
                    alt={`${props.first} ${props.last}`}
                />
            </div>
            <div className="profileInfo">
                <h1> Welcome to your profile, {props.first}!</h1>

                <Bio bio={props.bio} setBio={(arg) => props.setBio(arg)} />
            </div>
            <div className="profileInfo">
                {props.id && <Friends id={props.id} />}
            </div>
        </div>
    );
}
