const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db");
const cookieSession = require("cookie-session");
const bcrypt = require("./bcrypt");
const COOKIE_SECRET =
    process.env.COOKIE_SECRET || require("./secrets.json").COOKIE_SECRET;

app.use(compression());
app.use(express.json());
app.use(
    cookieSession({
        secret: COOKIE_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: true,
    })
);

app.use(express.static(path.join(__dirname, "..", "client", "public")));

//fetch.start

app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session.userId,
    });
});

app.post("/registration", (req, res) => {
    if (
        req.body.first &&
        req.body.last &&
        req.body.email &&
        req.body.password
    ) {
        bcrypt
            .hash(req.body.password)
            .then(function (hash) {
                const hashedPassword = hash;

                // db.add user must be returned in order to be handled in the catch

                return db
                    .addUser(
                        req.body.first.replace(/\s\s+/g, " ").trim(),
                        req.body.last.replace(/\s\s+/g, " ").trim(),
                        req.body.email.trim(),
                        hashedPassword
                    )
                    .then((result) => {
                        console.log("Inside addUser");
                        req.session.userId = result.rows[0].id;

                        res.json({ success: true });
                    })
                    .catch((err) => {
                        console.log("error in db social network ", err);
                        res.json({
                            success: false,
                            error: true,
                        });
                    });
            })
            .catch((err) => {
                console.log("error in db socialnetwork ", err);
                res.json({
                    success: false,
                    error: true,
                });
            });
    } else {
        res.json({
            success: false,
            error: true,
        });
    }
});
app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
