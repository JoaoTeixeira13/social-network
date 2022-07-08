import { Component } from "react";
import { Link } from "react-router-dom";

export default class Registration extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };

        // this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    handleSubmit() {

        fetch("/registration", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.success) {
                    location.reload();
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => {
                console.log("error in registration ", err);
                this.setState({
                    error: true,
                });
            });
    }

    render() {
        return (
            <div className="form">
                <h1>Register</h1>
                <Link to="/login">
                    <h1>Click here to Log in.</h1>
                </Link>

                {this.state.error && (
                    <p className="error">oooops! something went wrong. Please retry.</p>
                )}
                <input
                    type="text"
                    name="first"
                    placeholder="first"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    type="text"
                    name="last"
                    placeholder="last"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="email"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    onChange={(e) => this.handleChange(e)}
                />
                <button onClick={() => this.handleSubmit()}>Register</button>
            </div>
        );
    }
}
