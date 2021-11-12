module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
    },
    plugins: ['mocha'],
    extends: ['eslint:recommended', 'airbnb-base', 'prettier'],
};
