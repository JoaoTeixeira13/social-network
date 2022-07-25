import { Component } from "react";
import { Link } from "react-router-dom";

export default class ResetPassword extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
            view: 1,
        };

        // this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    verifyEmail() {
        fetch("/password/reset/start", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.success) {
                    this.setState({
                        view: 2,
                        error: false,
                    });
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => {
                console.log("error in email verification ", err);
                this.setState({
                    error: true,
                });
            });
    }
    newPassword() {
        fetch("/password/reset/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.success) {
                    this.setState({
                        view: 3,
                        error: false,
                    });
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => {
                console.log("error in email verification ", err);
                this.setState({
                    error: true,
                });
            });
    }
    determineViewToRender() {
        if (this.state.view === 1) {
            return (
                <div className="form" key={"view1"}>
                    <p>
                        Please enter the email address with which you
                        registered.
                    </p>

                    <input
                        type="email"
                        name="email"
                        placeholder="email"
                        onChange={(e) => this.handleChange(e)}
                    />

                    <button onClick={() => this.verifyEmail()}>Submit</button>
                </div>
            );
        } else if (this.state.view === 2) {
            return (
                <div key={"view2"}>
                    <p>
                        Please input the code you received via email and your
                        new password.
                    </p>
                    <input
                        type="text"
                        name="code"
                        placeholder="code"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="new password"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <button onClick={() => this.newPassword()}>Submit</button>
                </div>
            );
        } else if (this.state.view === 3) {
            return (
                <div key={"view1"}>
                    <p>
                        You have successfully updated your password! You may
                        proceed to login.
                    </p>
                </div>
            );
        }
    }

    render() {
        return (
            <div className="form">
                {this.state.error && (
                    <p className="error">
                        Oooops! Something went wrong, please retry.
                    </p>
                )}
                {this.determineViewToRender()}

                <Link to="/login">
                    <h2>Back to Login</h2>
                </Link>
            </div>
        );
    }
}
