const path = require('path');

module.exports = {
    entry: './assets/ts/index.ts',
    module: {
        rules: [
            {
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [ '.ts', '.js' ],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'assets/js/'),
    },
    mode: "production"
};