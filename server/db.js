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

// user queries

module.exports.addUser = (firstName, lastName, email, password) => {
    const q = `INSERT INTO users(first, last, email, password) VALUES ($1, $2, $3, $4)
    RETURNING id`;
    const param = [firstName, lastName, email, password];
    return db.query(q, param);
};
