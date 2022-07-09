import { BrowserRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./resetPassword";

export default function Welcome() {
    return (
        <div id="welcome">
            <div className="welcome-hero">
                <h1>
                    <span className="witches">Witches</span> <br /> & <br />
                    <span className="writers">Writers</span> <br /> & <br />
                    <span className="webdevs">WebDevs</span>
                </h1>
            </div>
            <BrowserRouter>
                <div className="welcome-paths">
                    <Route exact path="/">
                        <Registration />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/reset">
                        <ResetPassword />
                    </Route>
                </div>
            </BrowserRouter>
        </div>
    );
}
