const spicedPg = require("spiced-pg");
//below we have information that we need for our db connection
//which db do we talk to?
const database = "socialnetwork";

//which user is running our queries in the db?
const username = "postgres";

////whats the user's passwors?
const password = "postgres";

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${username}:${password}@localhost:5432/${database}`
);

// Logged out experience

module.exports.addUser = (firstName, lastName, email, password) => {
    const q = `INSERT INTO users(first, last, email, password) VALUES ($1, $2, $3, $4)
    RETURNING id`;
    const param = [firstName, lastName, email, password];
    return db.query(q, param);
};

module.exports.emailVerification = (email) => {
    return db.query(
        `SELECT users.*
    FROM users
    WHERE email = $1`,
        [email]
    );
};

module.exports.saveCode = (email, code) => {
    const q = `INSERT INTO reset_codes(email, code)
     VALUES ($1, $2)
     RETURNING *
    `;
    const param = [email, code];
    return db.query(q, param);
};

module.exports.findCode = (email) => {
    return db.query(
        `SELECT reset_codes.email, reset_codes.code
    FROM reset_codes
    WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
    AND email = $1
    ORDER BY id DESC   
    LIMIT 1 `,
        [email]
    );
};

module.exports.updatePassword = (password, email) => {
    const q = `UPDATE users
    SET password = $1 
    WHERE email = $2`;

    const param = [password, email];
    return db.query(q, param);
};

//Logged in experience

module.exports.uploadProfilePicture = (url, userId) => {
    const q = `UPDATE users
    SET imageUrl = $1 
    WHERE id = $2
    RETURNING imageUrl`;

    const param = [url, userId];
    return db.query(q, param);
};
module.exports.fetchProfile = (id) => {
    return db.query(
        `SELECT users.first, users.last, users.imageUrl, users.bio
    FROM users
    WHERE id = $1
    LIMIT 1`,
        [id]
    );
};

module.exports.updateBio = (bio, userId) => {
    const q = `UPDATE users
    SET bio = $1 
    WHERE id = $2
    RETURNING bio`;

    const param = [bio, userId];
    return db.query(q, param);
};
