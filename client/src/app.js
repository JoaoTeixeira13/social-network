import { Component } from "react";
import ProfilePicture from "./profilePicture";
import Uploader from "./uploader";

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

        //make fetch request to server to get info about user
        //set state and update
    }
    toggleModal() {
        this.setState({ uploaderIsVisible: !this.state.uploaderIsVisible });
    }
    methodInApp(arg) {
        console.log(
            "method is running in app and argument passed tp it is: ",
            arg
        );
    }
    render() {
        return (
            <div>
                <h1>Hello from App</h1>
                <img src="/logo.jpg" alt="logo" />
                <ProfilePicture
                    first={this.state.first}
                    last={this.state.last}
                    imageUrl={this.state.imageUrl}
                />
                <h2 onClick={() => this.toggleModal()}>
                    Click here to toggle uploader visibility
                </h2>
                {this.state.uploaderIsVisible && (
                    <Uploader methodInApp={this.methodInApp} />
                )}
            </div>
        );
    }
}
