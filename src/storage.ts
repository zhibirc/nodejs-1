import { FastifyLoggerInstance } from 'fastify';
import cloneDeep from './utilities/cloneDeep';
import filterMovieAttributes from './utilities/filterMovieAttributes';


export type UserInfo = {
    email: string,
    password: string,
    role: string,
    movieFavoritesList: string[],
    [key: string]: any
}


export interface IStorage {
    readonly logger: FastifyLoggerInstance,
    findUser: (email: unknown) => UserInfo | undefined,
    addUser: (userInfo: UserInfo) => void,
    updateUser: (userInfo: UserInfo) => boolean,
    getUserFavorites: (email: string, filters?: string) => object[],
    add: (data: any) => object | boolean,
    read: (id: string | null, filters?: string) => object[],
    update: (id: string, data: any) => object | boolean,
    delete: (id: string) => boolean,
    isExist: (id: string) => boolean
}


export class Storage implements IStorage {
    readonly logger: FastifyLoggerInstance;
    private __store!: {
        users: UserInfo[],
        movies: {[key: string]: any}[],
    }

    constructor ( logger: FastifyLoggerInstance ) {
        this.logger = logger;
        Object.defineProperty(this, '__store', {
            value: {
                users: [],
                movies: []
            }
        });
    }

    findUser ( email: unknown ) {
        const user = this.__store.users.find(user => user.email === email);

        return user && cloneDeep(user);
    }

    addUser ( userInfo: UserInfo ) {
        this.__store.users.push({
            ...userInfo
        });
    }

    updateUser ( userInfo: UserInfo): boolean {
        const entryIndex = this.__store.users.findIndex(user => user.email === userInfo.email);

        if ( entryIndex === -1 ) {
            return false;
        }

        this.__store.users[entryIndex] = cloneDeep(userInfo);

        return true;
    }

    getUserFavorites ( email: string, filters?: string ) {
        const { movieFavoritesList } = this.findUser(email);
        const payload = movieFavoritesList.map(
            (id: string) => this.__store.movies.find(item => item.imdbID === id || item.name === id)
        );

        return filters ? filterMovieAttributes(cloneDeep(payload), filters) : payload;
    }

    add ( data: any ) {
        const { imdbID: id, name } = data;

        if ( !id && !name ) {
            return false;
        }

        let index = id
            ? this.__store.movies.findIndex(item => item.imdbID === id)
            : this.__store.movies.findIndex(item => item.name === name);

        index === -1
            ? this.__store.movies.push(data)
            // data can be updated, for example rating, votes, awards etc., so update in storage
            : (this.__store.movies[index] = data);

        return data;
    }

    read ( id: string | null, filters?: string ) {
        const payload = id
            ? cloneDeep(this.__store.movies.filter(item => item.imdbID === id))
            : cloneDeep(this.__store.movies);

        return filters ? filterMovieAttributes(payload, filters) : payload;
    }

    update ( id: string, data: any ) {
        const entry = this.__store.movies.find(item => item.imdbID === id);

        if ( entry ) {
            const { comment, personalScore } = data;

            if ( comment === '' || comment == null ) {
                delete entry.comment;
            } else {
                entry.comment = comment;
            }

            if ( personalScore == null ) {
                delete entry.personalScore;
            } else {
                entry.personalScore = personalScore;
            }

            return {...entry};
        }

        return false;
    }

    delete ( id: string ) {
        const entry = this.__store.movies.find(item => item.imdbID === id);

        if ( entry ) {
            this.__store.movies.splice(this.__store.movies.indexOf(entry), 1);

            return true;
        }

        return false;
    }

    isExist ( id: string ): boolean {
        // as far as user can add movies which are not exist is OMDB database
        return Boolean(this.__store.movies.find(item => item.imdbID === id || item.name === id));
    }
}
