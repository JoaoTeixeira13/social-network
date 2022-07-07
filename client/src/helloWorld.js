import Greetee from "./greetee";
import Counter from "./counter";

export default function HelloWorld() {
    const myText = <h1>I love JSX!</h1>;
    const classForStyle = "some-class";
    const cohortName = "Cayenne";
    return (
        <div className={classForStyle}>
            <Greetee propName={cohortName} />
            <Greetee propName={"Merle"} />
            <Counter favFood="pasta" />
            {myText}
        </div>
    );
}
