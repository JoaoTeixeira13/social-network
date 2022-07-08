const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db");
const { sendEmail } = require("./ses.js");
const cookieSession = require("cookie-session");
const bcrypt = require("./bcrypt");
const COOKIE_SECRET =
    process.env.COOKIE_SECRET || require("./secrets.json").COOKIE_SECRET;

const cryptoRandomString = require("crypto-random-string");

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

//registration route

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

//login route

app.post("/login", (req, res) => {
    if (req.body.email && req.body.password) {
        db.emailVerification(req.body.email)

            .then((result) => {
                return bcrypt
                    .compare(req.body.password, result.rows[0].password)
                    .then(function (hashComparison) {
                        if (hashComparison) {
                            req.session.userId = result.rows[0].id;
                            res.json({ success: true });
                        } else {
                            res.json({
                                success: false,
                                error: true,
                            });
                        }
                    });
            })
            .catch((err) => {
                console.log("error in db. loging user in ", err);
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

//forgot the password route

app.post("/password/reset/start", (req, res) => {
    db.emailVerification(req.body.email)
        .then((result) => {
            if (!result.rows.length) {
                res.json({
                    success: false,
                    error: true,
                });

                console.log("no match");
            } else {
                console.log("we ave a match");

                const secretCode = cryptoRandomString({
                    length: 6,
                });

                db.saveCode(req.body.email, secretCode)
                    .then(() => {
                        sendEmail(secretCode, "Password Reset");
                    })
                    .then(res.json({ success: true }))
                    .catch((err) => {
                        console.log(
                            "error in db. verifying user's email in ",
                            err
                        );
                        res.json({
                            success: false,
                            error: true,
                        });
                    });
            }
        })
        .catch((err) => {
            console.log("error in db. verifying user's email in ", err);
            res.json({
                success: false,
                error: true,
            });
        });
});

app.post("/password/reset/verify", (req, res) => {
    db.findCode(req.body.email).then((results) => {
        console.log("body to compare", req.body.code === results.rows[0].code);
        if (req.body.code === results.rows[0].code) {
            bcrypt
                .hash(req.body.password)
                .then(function (hash) {
                    const hashedPassword = hash;

                    // db.add user must be returned in order to be handled in the catch

                    return db
                        .updatePassword(hashedPassword, req.body.email)
                        .then(() => {
                            console.log("Inside updated Password");
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
