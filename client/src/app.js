import { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

import ProfilePicture from "./profilePicture";
import Uploader from "./uploader";
import Logo from "./logo";
import Profile from "./profile";
import FindPeople from "./findPeople";
import OtherProfile from "./otherProfile";

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

        fetch("/api/user")
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
    logout() {
        console.log("user wants to logout");
        fetch("/logout")
            .then((resp) => resp.json())
            .then(() => {
                location.reload();
            })
            .catch((err) => {
                console.log("error is ", err);
            });
    }
    render() {
        return (
            <div>
                <BrowserRouter>
                    <nav className="profileHeader">
                        <Logo />
                        <Link to="/find">
                            <h2>Users</h2>
                        </Link>
                        <Link to="/">
                            <h2>Profile</h2>
                        </Link>
                        <Link to="/">
                            <h2 onClick={() => this.logout()}>Logout</h2>
                        </Link>
                        

                        <ProfilePicture
                            first={this.state.first}
                            last={this.state.last}
                            imageUrl={this.state.imageUrl}
                            modalCallback={() => {
                                this.toggleModal();
                            }}
                        />
                    </nav>
                    <Route exact path="/">
                        <Profile
                            first={this.state.first}
                            last={this.state.last}
                            imageUrl={this.state.imageUrl}
                            bio={this.state.bio}
                            setBio={(arg) => this.setBio(arg)}
                        />
                    </Route>

                    {this.state.uploaderIsVisible && (
                        <Uploader
                            modalCallback={() => {
                                this.toggleModal();
                            }}
                            settingProfilePic={(arg) =>
                                this.settingProfilePic(arg)
                            }
                        />
                    )}
                    <Route path="/find">
                        <FindPeople />
                    </Route>
                    <Route path="/user/:otherUserId">
                        <OtherProfile />
                    </Route>
                </BrowserRouter>
            </div>
        );
    }
}
