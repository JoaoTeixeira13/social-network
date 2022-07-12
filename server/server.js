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
const multer = require("multer");
const s3 = require("./s3");
const uidSafe = require("uid-safe");

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

app.get("/user/id.json", (req, res) => {
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
                    })
                    .catch((err) => {
                        console.log("error in db. loging user in ", err);
                        res.json({
                            success: false,
                            error: true,
                        });
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

//password reset

app.post("/password/reset/start", (req, res) => {
    db.emailVerification(req.body.email)
        .then((result) => {
            if (!result.rows.length) {
                res.json({
                    success: false,
                    error: true,
                });
            } else {
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
    if (req.body.code && req.body.password) {
        db.findCode(req.body.email).then((results) => {
            if (req.body.code === results.rows[0].code) {
                bcrypt
                    .hash(req.body.password)
                    .then(function (hash) {
                        const hashedPassword = hash;

                        // db.update Password must be returned in order to be handled in the catch

                        return db
                            .updatePassword(hashedPassword, req.body.email)
                            .then(() => {
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
    } else {
        res.json({
            success: false,
            error: true,
        });
    }
});

//fetch profile data

app.get("/user", (req, res) => {
    db.fetchProfile(req.session.userId)
        .then((results) => {
            const profile = results.rows[0];
            res.json({
                success: true,
                profile,
            });
        })
        .catch((err) => {
            console.log("error in fetching user's profile ", err);
            res.json({
                success: false,
                error: true,
            });
        });
});

//profile picture upload

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, path.join(__dirname, "uploads"));
    },
    filename(req, file, callback) {
        uidSafe(24).then((randomString) => {
            //keep the original file extention

            // use extname method to be found on the core path library
            callback(null, `${randomString}${path.extname(file.originalname)}`);
        });
    },
});
const uploader = multer({
    storage,
    limits: {
        fileSize: 2097152,
    },
});

app.post(
    "/uploadProfilePic",
    uploader.single("image"),
    s3.upload,
    (req, res) => {
        const url = "https://s3.amazonaws.com/spicedling/" + req.file.filename;

        if (url) {
            db.uploadProfilePicture(url, req.session.userId)
                .then((result) => {
                    res.json({
                        sucess: true,
                        payload: result.rows[0],
                    });
                })
                .catch((err) => {
                    console.log("error is ", err);
                });
        } else {
            console.log("invalid url");
        }
    }
);

app.post("/updateBio", (req, res) => {
    if (req.body.bio) {
        db.updateBio(req.body.bio, req.session.userId)
            .then((result) => {
                res.json({
                    sucess: true,
                    payload: result.rows[0],
                });
            })
            .catch((err) => {
                console.log("error is ", err);
            });
    } else {
        console.log("error in updting user's bio ", err);
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
