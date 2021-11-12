module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
    },
    plugin: ['mocha'],
    extends: ['eslint:recommended', 'airbnb-base', 'prettier'],
};
