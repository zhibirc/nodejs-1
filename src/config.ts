/**
 * Main application config.
 */

const cliArgs = process.argv.slice(4);
const apiKey = cliArgs[0] === '--KEY' || cliArgs[0] === '--key' ? cliArgs[1] : null;


export default Object.freeze({
    APP_PORT: process.env.APP_PORT || 8080,
    OMDB_API_BASE_URL: `http://www.omdbapi.com/`,
    OMDB_API_KEY: apiKey,
    HASH_SALT: 's(IsCt--ZnXwcaH2CshnaTa8UB?6thb%CxNFDkt5rKKy+~wG4ztIMq6!x1A6>',
    // JWT (JSON Web Token) settings
    JWT_SECRET: 'PpF2pFMqvrSn9tzk2qvM6iyrbLbagyZ3hIOFLuK1',
    // 15 min
    JWT_TTL_SEC: 900
});
