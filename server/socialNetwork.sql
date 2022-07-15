DROP TABLE IF EXISTS reset_codes;
DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS users;

 


CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       first VARCHAR NOT NULL CHECK (first != ''),
       last VARCHAR NOT NULL CHECK (last != ''),
       email VARCHAR NOT NULL CHECK (email != '') UNIQUE,
       imageUrl TEXT,
       bio TEXT,
       password VARCHAR NOT NULL CHECK (password != '')
   );

   CREATE TABLE reset_codes(
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL REFERENCES users(email),
    code VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE friendships(
      id SERIAL PRIMARY KEY,
      sender_id INT REFERENCES users(id) NOT NULL,
      recipient_id INT REFERENCES users(id) NOT NULL,
      accepted BOOLEAN DEFAULT false
  );


   