import { Component } from "react";

class NameOfClassComponent extends Component {
    constructor() {
        super();
        this.state = {};
    }
    render() {
        return <h1> element created by the class component</h1>;
    }
}
class Counter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
        };
        //we bind the "this" from here
        // this.incrementCount = this.incrementCount.bind(this);
    }
    componentDidMount() {
        console.log("Component did mount");
    }
    incrementCount() {
        console.log("the user wants to increment the count");
        this.setState({
            count: this.state.count + 1,
        });
    }
    render() {
        return (
            <div>
                <h1>favFood prop val:{this.props.favFood}</h1>
                <h1>I am the counter</h1>
                <h2>current count is {this.state.count}</h2>
                {/* arrow function has acces to "this" one level above*/}
                <button onClick={() => this.incrementCount()}>
                    Click me to count up
                </button>
            </div>
        );
    }
}
export default Counter;
