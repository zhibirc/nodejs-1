// external
import axios from 'axios';

// configuration
import config from '../config';


const { OMDB_API_BASE_URL, OMDB_API_KEY } = config;


export default async function ( name: string ) {
    let { data: info } = await axios.get(`${OMDB_API_BASE_URL}?apikey=${OMDB_API_KEY}&t=${name}`);

    if ( info.Error ) {
        info = { name };
    }

    return info;
}
