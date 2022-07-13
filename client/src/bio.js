import { Component } from "react";

export default class Bio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTextArea: false,
            draftBio: "",
        };
    }


    handleBioChange(e) {
        
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    activateEdit() {
        this.setState({
            showTextArea: true,
            draftBio: this.props.bio,
        });
    }

    submitBio() {
        fetch("/updateBio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ bio: this.state.draftBio }),
        })
            .then((resp) => resp.json())
            .then((data) => {
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
        return (
            <div>
                {this.state.showTextArea && (
                    <div className="bioEdit">
                        <h1>I am the bio editor</h1>
                        <textarea
                            name="draftBio"
                            value={this.state.draftBio}
                            onChange={(e) => this.handleBioChange(e)}
                        ></textarea>
                        <button onClick={() => this.submitBio()}>
                            Submit Bio
                        </button>
                    </div>
                )}
                {!this.state.showTextArea && this.props.bio && (
                    <div>
                        <p>{this.props.bio}</p>
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
        );
    }
}
