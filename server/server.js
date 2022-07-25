const express = require("express");
const app = express();
const server = require("http").Server(app);
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
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

app.use(compression());
app.use(express.json());
app.use(
    cookieSession({
        secret: COOKIE_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: true,
    })
);

const cookieSessionMiddleware = cookieSession({
    secret: COOKIE_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 14,
    sameSite: true,
});

io.use((socket, next) => {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

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

app.get("/api/user", (req, res) => {
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

// update biography route

app.post("/updateBio", (req, res) => {
    if (req.body.bio) {
        db.updateBio(req.body.bio, req.session.userId)
            .then((result) => {
                res.json({
                    success: true,
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

// find users/ newest users to register route

app.get("/api/users", (req, res) => {
    if (req.query.userSearch) {
        db.getMatchingUsers(req.query.userSearch, req.session.userId)
            .then((result) => {
                res.json({
                    success: true,
                    payload: result.rows,
                });
            })
            .catch((err) => {
                console.log("error is ", err);
            });
    } else {
        db.newestUsers(req.session.userId)
            .then((result) => {
                res.json({
                    success: true,
                    payload: result.rows,
                });
            })
            .catch((err) => {
                console.log("error is ", err);
            });
    }
});

//search for other profiles: is the input a number? does the input match with the user id?
//does the query return an existing user?

app.get("/api/user/:id", async (req, res) => {
    if (!isNaN(req.params.id)) {
        if (req.session.userId == req.params.id) {
            res.json({
                ownProfile: true,
            });
        } else {
            try {
                const results = await db.fetchProfile(req.params.id);

                const profile = results.rows[0];
                if (!profile) {
                    res.json({
                        noMatch: true,
                    });
                } else {
                    res.json({
                        success: true,
                        profile,
                    });
                }
            } catch (error) {
                console.log("error in fetching user's profile ", err);
                res.json({
                    success: false,
                    error: true,
                });
            }
        }
    } else {
        res.json({
            ownProfile: true,
        });
    }
});

const buttonValues = {
    add: "Add Friend",
    accept: "Accept Friend Request",
    cancel: "Cancel Friend Request",
    remove: "Unfriend",
};

//fetching the type of relation between two users

app.get("/api/relation/:viewedUser", async (req, res) => {
    try {
        const results = await db.friendshipRelation(
            req.session.userId,
            req.params.viewedUser
        );
        const userRelation = results.rows[0];

        if (!userRelation) {
            res.json({
                buttonText: buttonValues.add,
            });
        } else {
            if (userRelation.accepted) {
                res.json({
                    buttonText: buttonValues.remove,
                });
            } else {
                if (userRelation.sender_id == req.session.userId) {
                    res.json({
                        buttonText: buttonValues.cancel,
                    });
                } else if (userRelation.recipient_id == req.session.userId) {
                    res.json({
                        buttonText: buttonValues.accept,
                    });
                } else {
                    res.json({
                        success: false,
                        error: true,
                    });
                }
            }
        }
    } catch (err) {
        console.log("error in fetching users' relation ", err);
        res.json({
            success: false,
            error: true,
        });
    }
});

//handling friendship button

app.post("/api/requestHandle/:viewedUser", async (req, res) => {
    console.log("requested body is", req.body);

    if (req.body.buttonText === buttonValues.add) {
        try {
            await db.requestFriendship(
                req.session.userId,
                req.params.viewedUser
            );
            res.json({
                buttonText: buttonValues.cancel,
            });
        } catch (err) {
            console.log("error in fetching users' relation ", err);
            res.json({
                success: false,
                error: true,
            });
        }
    } else if (req.body.buttonText === buttonValues.accept) {
        try {
            await db.acceptFriendship(
                req.session.userId,
                req.params.viewedUser
            );
            res.json({
                buttonText: buttonValues.remove,
            });
        } catch (err) {
            console.log("error in fetching users' relation ", err);
            res.json({
                success: false,
                error: true,
            });
        }
    } else if (
        req.body.buttonText === buttonValues.cancel ||
        req.body.buttonText === buttonValues.remove
    ) {
        try {
            await db.unfriendOrCancelFriendship(
                req.session.userId,
                req.params.viewedUser
            );
            res.json({
                buttonText: buttonValues.add,
            });
        } catch (err) {
            console.log("error in fetching users' relation ", err);
            res.json({
                success: false,
                error: true,
            });
        }
    } else {
        res.json({
            success: false,
            error: true,
        });
    }
});

//display friends/friend requests (post request on /api/requestHandle/:viewedUser route)

app.get("/friendsWannabees", async (req, res) => {
    try {
        const results = await db.getFriendsAndWannabees(req.session.userId);
        const friendsAndPretenders = results.rows;

        res.json({
            success: true,
            friendsAndPretenders,
        });
    } catch (err) {
        console.log("error in fetching friends and wannabees", err);
        res.json({
            success: false,
            error: true,
        });
    }
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.json({ success: true });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

//socket communication
let onlineUsers = {};

io.on("connection", async (socket) => {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;

    //keeping track of online users

    onlineUsers[userId] ||= [];

    onlineUsers[userId] = [...onlineUsers[userId], socket.id];

    const onlineStatus = async () => {
        try {
            const onlineQuery = Object.keys(onlineUsers);
            const { rows: onlineResults } = await db.onlineUsers(onlineQuery);
            io.emit("online-users", onlineResults);
        } catch (err) {
            console.log("error while fetching online users", err);
        }
    };

    try {
        socket.on("disconnect", () => {
            onlineUsers[userId] = onlineUsers[userId].filter(
                (elem) => elem != socket.id
            );
            onlineUsers[userId] = onlineUsers[userId].filter(
                (elem) => elem != []
            );

            if (!onlineUsers[userId].length) {
                delete onlineUsers[userId];
            }
            onlineStatus();
        });
    } catch (err) {
        console.log("error while fetching online users", err);
    }

    try {
        socket.on("req-online-users", () => {
            onlineStatus();
        });
    } catch (err) {
        console.log("error while fetching online users", err);
    }

    try {
        socket.on("new-message", async (newMsg, recipient) => {
            if (recipient === 0) {
                try {
                    const { rows: messageQuery } = await db.newMessage(
                        newMsg,
                        userId
                    );

                    const { rows: user } = await db.fetchProfile(userId);
                    const composedMessage = {
                        id: messageQuery[0].id,
                        first: user[0].first,
                        imageurl: user[0].imageurl,
                        last: user[0].last,
                        message: messageQuery[0].message,
                        user_id: messageQuery[0].user_id,
                    };

                    io.emit("add-new-message", composedMessage);
                } catch (err) {
                    console.log("error while inserting new message", err);
                }
            } else {
                try {
                    const { rows: messageQuery } = await db.newPrivateMessage(
                        newMsg,
                        userId,
                        recipient
                    );

                    const { rows: user } = await db.fetchProfile(userId);
                    const composedMessage = {
                        id: messageQuery[0].id,
                        first: user[0].first,
                        imageurl: user[0].imageurl,
                        last: user[0].last,
                        message: messageQuery[0].message,
                        user_id: messageQuery[0].sender_id,
                        recipient_id: recipient,
                    };

                    socket.emit("add-new-message", composedMessage);
                    onlineUsers[messageQuery[0].recipient_id].map((socket) => {
                        io.to(socket).emit("add-new-message", composedMessage);
                    });
                } catch (err) {
                    console.log("error while inserting new message", err);
                }
            }

            //second query for user data, compose message
        });
    } catch (err) {
        console.log("error while inserting new message", err);
    }

    //private messages, global chat room

    try {
        socket.on("fetch-messages", async (viewedUser) => {
            if (viewedUser === 0) {
                // handling global chat messages (no user with id 0 exists)

                try {
                    const { rows: messages } = await db.newestMessages();

                    socket.emit("last-10-messages", {
                        messages: messages.reverse(),
                    });
                } catch (err) {
                    console.log("error while fetching first 10 messages", err);
                }
            } else {
                //handling private messages
                const { rows: messages } = await db.privateMessages(
                    userId,
                    viewedUser
                );

                socket.emit("last-10-messages", {
                    messages: messages.reverse(),
                });
            }
        });
    } catch (err) {
        console.log("error while fetching private messages", err);
    }
});
