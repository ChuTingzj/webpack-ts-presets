import {merge} from 'webpack-merge'
import * as webpack from "webpack";
import {resolve} from "path";
const common = require('./webpack.config.common')
module.exports = merge(common,{
    output: {
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['css-loader','postcss-loader']
            },
            {
                test: /\.s[ac]ss$/,
                use: [ 'css-loader', 'postcss-loader','sass-loader']
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            happyPackMode: false
                        }
                    }
                ]
            },
            {
                test: /\.m?jsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheCompression: false,
                            cacheDirectory: resolve(__dirname, '../node_modules/.cache/babel-loader')
                        }
                    }
                ]
            }
        ]
    },
    devtool: 'eval-cheap-module-source-map',
    devServer: {
        hot: true,
        open: true,
        historyApiFallback: true,
        port: 3000,
        host: '127.0.0.1'
    },
})
