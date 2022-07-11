import { Component } from "react";
import ProfilePicture from "./profilePicture";
import Uploader from "./uploader";
import Logo from "./logo";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            first: "Layla",
            last: "Arias",
            imageUrl: "",
            uploaderIsVisible: false,
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
                });
            })
            .catch((err) => {
                console.log("error is ", err);
            });
    }
    toggleModal() {
        this.setState({ uploaderIsVisible: !this.state.uploaderIsVisible });
    }
    settingProfilePic = (arg) => {
        this.setState({
            imageUrl: arg,
        });
    };
    render() {
        return (
            <div>
                <h1>Hello from App</h1>
                <Logo />
                <ProfilePicture
                    first={this.state.first}
                    last={this.state.last}
                    imageUrl={this.state.imageUrl}
                    modalCallback={() => {
                        this.toggleModal();
                    }}
                />

                {this.state.uploaderIsVisible && (
                    <Uploader
                        modalCallback={() => {
                            this.toggleModal();
                        }}
                        settingProfilePic={this.settingProfilePic}
                    />
                )}
            </div>
        );
    }
}
