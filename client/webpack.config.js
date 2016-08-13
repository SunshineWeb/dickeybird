var path = require('path');
var webpack = require('webpack');
module.exports = {
    entry: {
        main: ["./main.js"],
        mainwg: ["./main.1.js"]

    },
    output: {
        path: "./output/",
        filename: "[name].js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
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
        //new webpack.optimize.UglifyJsPlugin({ minimize: true })
    ]
};