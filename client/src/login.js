import { Component } from "react";
import { Link } from "react-router-dom";

export default class Login extends Component {
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
        fetch("/login", {
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
                <h1>Login</h1>
                <Link to="/">
                    <h1>Click here to Register</h1>
                </Link>
                <Link to="/reset">
                    <h1>Forgot your password?</h1>
                </Link>

                {this.state.error && (
                    <p className="error">
                        oooops! something went wrong.Please retry.
                    </p>
                )}

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
                <button onClick={() => this.handleSubmit()}>Login</button>
            </div>
        );
    }
}
