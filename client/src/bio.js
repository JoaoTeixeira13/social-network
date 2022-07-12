import { Component } from "react";

export default class Bio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTextArea: false,
            draftBio: "",
        };
    }

    //the bio that the user types in the bioeditor is the the draft bio,
    //the bio the user submits and successfully goes through the database is the official bio and should live in APP

    handleBioChange(e) {
        //in here keep track of the bio the user is typing
        //store the info in state (draft Bio)
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    activateEdit() {
        this.setState({
            showTextArea: true,
        });
    }

    submitBio() {
        console.log("user wants to submit bio");
        //this should run whenever the user clicks save(done writing bio)
        //Todo
        // make a fetch post request, send along this.state.draftBio
        //2. after the draft bio was successfully inserted in the db, make sure the server sends it back to react
        //3. once you get it back, this is now the official bio
        //call the apps function set bio here and pass it to the official bio
        //this.props.setBio(data)

        fetch("/updateBio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ bio: this.state.draftBio }),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("received data is,", data);
                console.log("data.success data is ", data.payload.bio);
                this.props.setBio(data.payload.bio);
                this.setState({
                    showTextArea: false,
                });
            })
            .catch((err) => {
                console.log("error in bioUpdate ", err);
                this.setState({
                    error: true,
                });
            });
    }

    render() {
        console.log("this draft bio is,", this.state.draftBio);

        return (
            <div>
                {this.state.showTextArea && (
                    <div className="bioEdit">
                        <h1>I am the bio editor</h1>
                        <textarea
                            name="draftBio"
                            onChange={(e) => this.handleBioChange(e)}
                        ></textarea>
                        <button onClick={() => this.submitBio()}>
                            Submit Bio
                        </button>
                    </div>
                )}
                {!this.state.showTextArea && this.props.bio && (
                    <div>
                        <p>{props.bio}</p>
                        <button onClick={() => this.activateEdit()}>
                            Edit Bio
                        </button>
                    </div>
                )}
                {!this.state.showTextArea && !this.props.bio && (
                    <div>
                        <button onClick={() => this.activateEdit()}>
                            Add bio
                        </button>
                    </div>
                )}
            </div>

            // if thetext area is hidden, check to see if there is a bio

            //if there is an existing bio, allow the user to EDIT
            // if there is no bio, allow the user to add a bio
            //whenever they click on the add or edit button, show the text area
        );
    }
}
