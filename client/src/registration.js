import { Component } from "react";

export default class Registration extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };

        // this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {

        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state", this.state)
        );
    }
    handleSubmit() {
        // console.log("clicked on the button");
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

                //Todo
                //if registration was not successful--render err conditionally
                //if registration was successfull: trigger page reload and we should end up
                //seing our logo
            })
            .catch((err) => {
                console.log("error in registration ", err);
                this.setState({
                    error: true,
                });
            });
    }

    //To do :
    //1.render 4 input fields + button ✅
    //2. capture the users input and store it s state ✅
    //3. when the user submits, send data
    //4. conditional rendor err message
    //5. if all goes well, show them the logo

    render() {
        return (
            <div>
                <h1>This is the registration component</h1>
                {this.state.error && (
                    <p className="error">oooops! something went wrong</p>
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
                <button onClick={() => this.handleSubmit()}>Submit</button>
            </div>
        );
    }
}
