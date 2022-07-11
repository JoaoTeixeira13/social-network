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
                    <Uploader methodInApp={this.methodInApp} />
                )}
            </div>
        );
    }
}
