import { Component } from "react";
import ProfilePicture from "./profilePicture";
import Uploader from "./uploader";
import Logo from "./logo";
import Profile from "./profile";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            first: "Layla",
            last: "Arias",
            imageUrl: "",
            uploaderIsVisible: false,
            bio: "",
        };
    }
    componentDidMount() {
        console.log("App mounted!");

        fetch("/user")
            .then((resp) => resp.json())
            .then((data) => {
                this.setState({
                    first: data.profile.first,
                    last: data.profile.last,
                    imageUrl: data.profile.imageurl,
                    bio: data.profile.bio,
                });
            })
            .catch((err) => {
                console.log("error is ", err);
            });
    }
    toggleModal() {
        this.setState({ uploaderIsVisible: !this.state.uploaderIsVisible });
    }
    settingProfilePic(arg) {
        this.setState({
            imageUrl: arg,
        });
    }
    setBio(newBio) {
        this.setState({
            bio: newBio,
        });
    }
    render() {
        return (
            <div>
                <div className="profileHeader">
                    <Logo />
                    <ProfilePicture
                        first={this.state.first}
                        last={this.state.last}
                        imageUrl={this.state.imageUrl}
                        modalCallback={() => {
                            this.toggleModal();
                        }}
                    />
                </div>

                <Profile
                    first={this.state.first}
                    last={this.state.last}
                    imageUrl={this.state.imageUrl}
                    bio={this.state.bio}
                    setBio={(arg) => this.setBio(arg)}
                />

                {this.state.uploaderIsVisible && (
                    <Uploader
                        modalCallback={() => {
                            this.toggleModal();
                        }}
                        settingProfilePic={(arg) => this.settingProfilePic(arg)}
                    />
                )}
            </div>
        );
    }
}
