/**
 * Main application config.
 *
 * @type {Readonly<{APP_PORT: number}>}
 */


module.exports = Object.freeze({
    APP_PORT: process.env.APP_PORT || 3000,
    ENV: process.argv[2] || 'n/a'
});
