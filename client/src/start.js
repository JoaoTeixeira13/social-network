import ReactDOM from "react-dom";
import Welcome from "./welcome";

fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        console.log("data", data);
        if (!data.userId) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            ReactDOM.render(
                <img src="/logo.jpg" alt="logo" />,
                document.querySelector("main")
            );
        }
    });
