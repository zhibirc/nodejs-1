/**
 * Main application config.
 */

const cliArgs = process.argv.slice(2);


export default Object.freeze({
    APP_PORT: process.env.APP_PORT || 8080,
    ENV: cliArgs[0] === '--ENV' || cliArgs[0] === '--env' ? cliArgs[1] : null
});
