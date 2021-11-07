import { FastifyLoggerInstance } from 'fastify';


const cloneDeep = (item: any[]) => JSON.parse(JSON.stringify(item));


export interface IStorage {
    readonly logger: FastifyLoggerInstance,
    add: (data: any) => object | boolean,
    read: (id?: string) => object[],
    update: (id: string, data: any) => object | boolean,
    delete: (id: string) => boolean
}

export class Storage implements IStorage {
    readonly logger: FastifyLoggerInstance;
    private __store!: {[key: string]: any}[];

    constructor ( logger: FastifyLoggerInstance ) {
        this.logger = logger;
        Object.defineProperty(this, '__store', {
            value: [],
            writable: true
        });
    }

    add ( data: any ) {
        const { imdbID: id, name } = data;

        if ( !id && !name ) {
            return false;
        }

        let index = id
            ? this.__store.findIndex(item => item.imdbID === id)
            : this.__store.findIndex(item => item.name === name);

        index === -1
            ? this.__store.push(data)
            // data can be updated, for example rating, votes, awards etc., so update in storage
            : (this.__store[index] = data);

        return data;
    }

    read ( id?: string ) {
        return id
            ? cloneDeep(this.__store.filter(item => item.imdbID === id))
            : cloneDeep(this.__store);
    }

    update ( id: string, data: any ) {
        const entry = this.__store.find(item => item.imdbID === id);

        if ( entry ) {
            const { comment, personalScore } = data;

            comment && (entry.comment = comment);
            personalScore && (entry.personalScore = personalScore);

            return {...entry};
        }

        return false;
    }

    delete ( id: string ) {
        const entry = this.__store.find(item => item.imdbID === id);

        if ( entry ) {
            this.__store.splice(this.__store.indexOf(entry), 1);

            return true;
        }

        return false;
    }
}
