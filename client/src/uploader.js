import { Component } from "react";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {};

    }
    componentDidMount() {
        console.log("Uploader just mounted");
    }

    uploadProfilePic(e) {
        e.preventDefault();

        fetch("/uploadProfilePic", {
            method: "POST",
            body: new FormData(e.target),
        })
            .then((res) => res.json())
            .then((data) => {
                this.props.settingProfilePic(data.payload.imageurl);
                this.props.modalCallback();
            })
            .catch((err) => {
                console.log("error is ", err);
            });
    }
    render() {
        return (
            <div className="modalWindow">
                <h2> Upload Profile Picture</h2>
                <form
                    onSubmit={(e) => this.uploadProfilePic(e)}
                    className="modalForm"
                >
                    {" "}
                    <label htmlFor="input-tag">
                        Browse
                        <input
                            name="image"
                            type="file"
                            accept="image/*"
                            id="input-tag"
                            required
                        />
                    </label>
                    <button>Submit</button>
                    <h2
                        onClick={() => this.props.modalCallback()}
                        className="closeModal"
                    >
                        X
                    </h2>
                </form>
            </div>
        );
    }
}
