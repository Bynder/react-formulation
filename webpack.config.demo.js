const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        app: [
            path.resolve(__dirname, 'demo', 'src', 'App.js'),
        ],
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'demo'),
        publicPath: '/',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            },
        }),
    ].concat(process.env.NODE_ENV === 'production'
        ? [
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    unused: true,
                    dead_code: true,
                    warnings: false,
                },
            }),
        ]
        : [
            new webpack.HotModuleReplacementPlugin(),
        ]),
    module: {
        loaders: [
            {
                test: /(\.jsx|\.js)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
        ],
    },
    resolve: {
        modules: [
            path.resolve('./demo/src'),
            'node_modules',
        ],
        alias: {
            'react-formulation$': path.resolve(__dirname, 'lib', 'react-formulation'),
        },
    },
};
