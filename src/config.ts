/**
 * Main application config.
 */

const cliArgs = process.argv.slice(4);
const apiKey = cliArgs[0] === '--KEY' || cliArgs[0] === '--key' ? cliArgs[1] : null;


export default Object.freeze({
    APP_PORT: process.env.APP_PORT || 8080,
    OMDB_API_BASE_URL: `http://www.omdbapi.com/?apikey=${apiKey}`
});
