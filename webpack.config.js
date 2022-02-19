const webpack = require('webpack')
const HtmlWebpackPluging = require('html-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = {
    entry: ['babel-polyfill', './src/script.js'],
    output: {
        filename: 'bundle.js'
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            { test: /\.js?$/, loader: 'babel-loader', exclude: /node_modules/ },
            { test: /\.css$/i, use: ["style-loader", "css-loader"] },
        ]
    },
    mode: 'production',
    devServer: {
        static: {
            directory: 'src',
            watch: true
        },
        hot: true,
        open: true,
        client: {
            webSocketURL: {
                hostname: "0.0.0.0",
                pathname: "/ws",
                port: 8080,
            }  
        }
        
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPluging({
            template: 'src/index.html',
            filename: 'index.html',
            inject: 'body'
        }),
        new Dotenv()
    ]
}