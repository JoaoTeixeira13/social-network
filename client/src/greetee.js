export default function Greetee(props) {
    console.log("greetee here:");
    console.log("props,", props);
    //if the component is not given a prop, it render the string stranger instead
    return <h2>Hello {props.propName || "stranger"}</h2>;
}
