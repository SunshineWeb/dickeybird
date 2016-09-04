var path = require('path');
var webpack = require('webpack');
module.exports = {
    entry: {
        realtimepanel: ["./node_modules/babel-es6-polyfill/polyfill.js", "./lib/sse.js", "./realboard/main.js"]

    },
    output: {
        path: "./output/",
        filename: "[name].js"
    },
    module: {
        loaders: [
            {
                test: /\.(css|less)$/,
                loader: 'style!css!less',
            },
            {
                test: /.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.less'],
        modulesDirectories: [
            'node_modules'
        ]
    },
    resolveLoader: {
        root: path.resolve(__dirname, 'node_modules')
    },
    plugins: [
        /*new webpack.optimize.UglifyJsPlugin({
            minimize: true, mangle: {
                props: {
                    regex: /^_|_$/,
                    ignore_quoted: true,
                },
            }
        })*/
    ]
};