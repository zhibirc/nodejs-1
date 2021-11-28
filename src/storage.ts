import { FastifyLoggerInstance } from 'fastify';
import cloneDeep from './utilities/cloneDeep';
import filterMovieAttributes from './utilities/filterMovieAttributes';
import { IDatabase } from './db';


export type UserInfo = {
    email: string,
    password: string,
    role: string,
    [key: string]: any
}

export type MetaInfo = {
    comment?: string,
    personalScore?: number
}

export interface IStorage {
    readonly logger: FastifyLoggerInstance,
    findUser: (email: unknown) => Promise<UserInfo | null>,
    addUser: (userInfo: UserInfo) => void,
    getUserFavorites: (email: string, filters?: string) => Promise<object[]>,
    setUserFavorites: (email: string, movieId: string, isFavorite: boolean) => Promise<void>,
    addMovie: (data: any, email: string) => Promise<number>,
    getMovies: (id: string | null, filters?: string) => Promise<object[]>,
    updateMovieMetaInfo: (id: string, data: any, email: string) => Promise<boolean>,
    deleteMovie: (id: string) => Promise<boolean>,
    isMovieExist: (movieId: string) => Promise<boolean>,
    setMovieMetaInfo: (data: MetaInfo, email: string, movieId: number) => void
}


export class Storage implements IStorage {
    readonly logger: FastifyLoggerInstance;
    private db!: IDatabase;

    constructor ( dbInstance, logger: FastifyLoggerInstance ) {
        this.logger = logger;
        Object.defineProperty(this, 'db', {
            value: dbInstance
        });
    }

    async findUser ( email: unknown ) {
        const result = await this.db.query('SELECT * from users WHERE email = $1', [email]);

        return result ? result?.rows[0] : null;
    }

    async addUser ( userInfo: UserInfo ) {
        const { email, password, role } = userInfo;

        await this.db.query('INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)', [email, password, role]);
    }

    async getUserFavorites ( email, filters ) {
        const { user_id } = await this.findUser(email);

        let payload = await this.db.query(`
            SELECT *
            FROM movies
            WHERE movie_id IN (
                SELECT movie_id
                FROM favorites
                WHERE user_id = $1
            )`, [user_id]
        );
        payload = payload.rows;

        return filters ? filterMovieAttributes(cloneDeep(payload), filters) : payload;
    }

    async setUserFavorites ( email, movieId, isFavorite ) {
        const { user_id } = await this.findUser(email);
        const { movie_id } = await this.getMovieById(movieId);

        if ( isFavorite ) {
            await this.db.query(`
                INSERT INTO
                    favorites (user_id, movie_id)
                VALUES ($1, $2)
                ON CONFLICT (user_id, movie_id)
                DO UPDATE SET user_id = $1, movie_id = $2
                `, [user_id, movie_id]
            );
        } else {
            await this.db.query('DELETE FROM favorites WHERE user_id = $1 AND movie_id = $2', [user_id, movie_id]);
        }
    }

    async addMovie ( data: any, email: string ) {
        const { imdbID: id, name } = data;

        const { user_id } = await this.findUser(email);
        const queryResult = await this.db.query(
            "SELECT * FROM movies WHERE data ->> 'imdbID' = $1 OR data ->> 'name' = $2",
            [id, name]
        );

        let movieId;

        if ( queryResult.rowCount === 0 ) {
            movieId = await this.db.query('INSERT INTO movies (data, user_id) VALUES ($1, $2) RETURNING movie_id', [data, user_id]);
        } else {
            // data can be updated, for example rating, votes, awards etc., so update in storage
            movieId = await this.db.query('UPDATE movies SET data = $1 WHERE movie_id = $2 RETURNING movie_id', [data, queryResult.rows[0].movie_id]);
        }

        return movieId.rows[0].movie_id;
    }

    async getMovies ( id: string | null, filters?: string ) {
        let queryResult;

        if ( id ) {
            queryResult = await this.db.query(`
                SELECT COALESCE(movies.data || meta.data, movies.data)
                FROM movies
                LEFT JOIN meta ON movies.movie_id = meta.movie_id
                WHERE movies.data ->> 'imdbID' = $1 OR movies.data ->> 'name' = $1
                `, [id]
            );

            return queryResult.rows[0].coalesce;
        }

        // "meta" field is used for combine all existent comments&scores for each movie
        queryResult = await this.db.query(`
            SELECT movies.data || jsonb_build_object('meta', jsonb_agg(meta.data))
            FROM movies
            LEFT JOIN meta ON movies.movie_id = meta.movie_id
            GROUP BY movies.movie_id;
            `, []
        );
        queryResult = queryResult.rows;

        return filters ? filterMovieAttributes(queryResult, filters) : queryResult;
    }

    async updateMovieMetaInfo ( id: string, data: any, email ) {
        const movie = await this.getMovieById(id);

        if ( !movie ) {
            return false;
        }

        await this.setMovieMetaInfo(data, email, movie.movie_id);

        return true;
    }

    async deleteMovie ( id: string ) {
        const queryResult = await this.db.query("DELETE FROM movies WHERE data ->> 'imdbID' = $1 OR data ->> 'name' = $1", [id]);

        return queryResult.rowCount === 1;
    }

    async setMovieMetaInfo ( data, email, movieId ) {
        const { user_id } = await this.findUser(email);

        await this.db.query(`
            INSERT INTO
                meta (data, movie_id, user_id)
            VALUES
                ($1, $2, $3)
            ON CONFLICT (movie_id, user_id)
            DO UPDATE SET data = $1
            `, [data, movieId, user_id]
        );
    }

    async getMovieById ( movieId: string ) {
        const queryResult = await this.db.query("SELECT * FROM movies WHERE data ->> 'imdbID' = $1 OR data ->> 'name' = $1", [movieId]);

        return queryResult.rows[0];
    }

    async isMovieExist ( movieId: string ) {
        const movie = await this.getMovieById(movieId);

        return Boolean(movie);
    }
}
