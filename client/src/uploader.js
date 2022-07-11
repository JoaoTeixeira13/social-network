import { Component } from "react";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        console.log("props inside uploader are: ", props);
    }
    componentDidMount() {
        console.log("Uploader just mounted");
    }
    methodInUploader(){
        //fetch post request and add the image 

        //once image is retrieved, call the method that lives in app 
        //and pass it the url of the image as an argument
        //form data sending image to DAtabase

        // newly inserted image must be the one that was retrieved from the database
        // call the function
        this.props.methodInApp("whooooa")
    }
    render() {
        return (
            <div>
                <h2> This is my Uploader component</h2>
                <h3 onClick={() => this.methodInUploader()}>
                    Click here to run uploader method
                </h3>
            </div>
        );
    }
}
