CREATE TABLE users (
    user_id       SERIAL PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role          VARCHAR(80),
    active        BOOL NOT NULL DEFAULT TRUE
);

CREATE TABLE movies (
    movie_id   SERIAL PRIMARY KEY,
    data       JSONB NOT NULL,
    user_id    INTEGER NOT NULL REFERENCES users(user_id)
);

CREATE TABLE meta (
    data JSONB,
    movie_id INTEGER NOT NULL REFERENCES movies(movie_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, user_id)
);

CREATE TABLE favorites (
    user_id  INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    movie_id INTEGER NOT NULL REFERENCES movies(movie_id) ON DELETE CASCADE
);

CREATE INDEX users_email_index ON users (email);
CREATE INDEX movies_data_index ON movies ((data ->> 'imdbID'));
