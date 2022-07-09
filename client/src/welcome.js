import { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./resetPassword";

export default class Welcome extends Component {
    constructor() {
        super();
        this.state = {
            witch: false,
            writer: false,
            webdev: false,
        };

        // this.handleChange = this.handleChange.bind(this);
    }
    witchEnter() {
        this.witch = true;

        this.setState({
            witch: true,
        });
    }
    witchLeave() {
        this.witch = false;

        this.setState({
            witch: false,
        });
    }
    writerEnter() {
        this.writer = true;

        this.setState({
            writer: true,
        });
    }
    writerLeave() {
        this.writer = false;

        this.setState({
            writer: false,
        });
    }
    webdevEnter() {
        this.webdev = true;

        this.setState({
            webdev: true,
        });
    }
    webdevLeave() {
        this.webdev = false;

        this.setState({
            webdev: false,
        });
    }
    render() {
        return (
            <div id="welcome">
                <div
                    className="welcome-hero"
                    style={{
                        background: this.witch
                            ? "url('/witches.jpg')"
                            : "" || this.writer
                            ? "url('/nawal.jpg')"
                            : "" || this.webdev
                            ? "url('/webdev.jpg')"
                            : "",
                    }}
                >
                    <h1>
                        <span
                            onMouseEnter={() => this.witchEnter()}
                            onMouseLeave={() => this.witchLeave()}
                            className="witches"
                        >
                            Witches
                        </span>{" "}
                        <br /> & <br />
                        <span
                            onMouseEnter={() => this.writerEnter()}
                            onMouseLeave={() => this.writerLeave()}
                            className="writers"
                        >
                            Writers
                        </span>{" "}
                        <br /> & <br />
                        <span
                            onMouseEnter={() => this.webdevEnter()}
                            onMouseLeave={() => this.webdevLeave()}
                            className="webdevs"
                        >
                            WebDevs
                        </span>
                    </h1>
                </div>
                <BrowserRouter>
                    <div className="welcome-paths">
                        <Route exact path="/">
                            <Registration />
                        </Route>
                        <Route path="/login">
                            <Login />
                        </Route>
                        <Route path="/reset">
                            <ResetPassword />
                        </Route>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
