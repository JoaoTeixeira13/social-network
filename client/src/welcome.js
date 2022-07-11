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
            vanishWitch: false,
            vanishWriter: false,
            vanishWebdev: false,
        };

        // this.handleChange = this.handleChange.bind(this);
    }
    witchEnter() {
        this.witch = true;
        (this.vanishWitch = false),
            (this.vanishWriter = false),
            (this.vanishWebdev = false),
            this.setState({
                witch: true,
                vanishWitch: false,
                vanishWriter: false,
                vanishWebdev: false,
            });
    }
    witchLeave() {
        this.witch = false;
        this.vanishWitch = true;

        this.setState({
            witch: false,
            vanishWitch: true,
        });
    }
    writerEnter() {
        this.writer = true;
        (this.vanishWitch = false),
            (this.vanishWriter = false),
            (this.vanishWebdev = false),
            this.setState({
                writer: true,
                vanishWitch: false,
                vanishWriter: false,
                vanishWebdev: false,
            });
    }
    writerLeave() {
        this.writer = false;
        this.vanishWriter = true;

        this.setState({
            writer: false,
            vanishWriter: true,
        });
    }
    webdevEnter() {
        this.webdev = true;
        (this.vanishWitch = false),
            (this.vanishWriter = false),
            (this.vanishWebdev = false),
            this.setState({
                webdev: true,
                vanishWitch: false,
                vanishWriter: false,
                vanishWebdev: false,
            });
    }
    webdevLeave() {
        this.webdev = false;
        this.vanishWebdev = true;

        this.setState({
            webdev: false,
            vanishWebdev: true,
        });
    }
    render() {
        return (
            <div id="welcome">
                <div
                    className={`welcome-hero${
                        this.witch
                            ? " witch-front"
                            : "" || this.writer
                            ? " writer-front"
                            : "" || this.webdev
                            ? " webdev-front"
                            : ""
                    } ${
                        this.vanishWitch
                            ? " vanishWitch"
                            : "" || this.vanishWriter
                            ? " vanishWriter"
                            : "" || this.vanishWebdev
                            ? " vanishWebdev"
                            : ""
                    }`}
                >
                    <h1
                        className={
                            this.witch || this.writer || this.webdev
                                ? " transparent-hero"
                                : ""
                        }
                    >
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
