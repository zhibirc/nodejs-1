/**
 * Implement hashing for arbitrary data (typically, for passwords).
 *
 * Use dynamic salt for hashing. Actually, salt is building with three steps:
 * 1) There is a fixed static random sequence of pattern /^\S{20,}$/i as a base salt.
 * 2) Each "non-word" character is replaced by other character based on its UTF code multiplied by 2.
 * 3) Given salt is concatenated with the sum of all character codes in input text.
 */

// built-in
import { createHash } from 'crypto';

// configuration
import config from '../config';


const getCharCodesSum = (text: string) => {
    // @ts-ignore
    return [...text].reduce((result, char) => result + char.charCodeAt(0), 0);
};


export class Hasher {
    private salt: string;

    constructor () {
        this.salt = config.HASH_SALT.replace(/\W/g, char => String.fromCharCode(char.charCodeAt(0) << 1));
    }

    // TODO: probably, implement PBKDF specification algorithm
    hash ( text: string ): string {
        this.salt += getCharCodesSum(text);

        return createHash('sha256')
            .update(this.salt.slice(0, this.salt.length >> 1) + text + this.salt.slice(this.salt.length >> 1))
            .digest('hex');
    }

    verify ( text: string, hash: string ): boolean {
        return this.hash(text) === hash;
    }
}
