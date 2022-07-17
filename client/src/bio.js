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
    closeEdit() {
        this.setState({
            showTextArea: false,
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
                        <h2>
                            Tell others about yourself, they are curious about
                            your life.{" "}
                        </h2>
                        <textarea
                            name="draftBio"
                            value={this.state.draftBio}
                            onChange={(e) => this.handleBioChange(e)}
                        ></textarea>
                        <div className="bioButtons">
                            <button onClick={() => this.submitBio()}>
                                Submit Bio
                            </button>
                            <button onClick={() => this.closeEdit()}>
                                Return
                            </button>
                        </div>
                    </div>
                )}
                {!this.state.showTextArea && this.props.bio && (
                    <div>
                        <h3>{this.props.bio}</h3>
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
