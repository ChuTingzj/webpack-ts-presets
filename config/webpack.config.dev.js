const {merge} = require('webpack-merge')
const common = require('./webpack.config.common')
const webpack = require('webpack')
const {resolve} = require('path')
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')
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
                test: cssRegex,
                exclude:cssModuleRegex,
                use: ['style-loader',{
                    loader:'css-loader',
                    options:{
                        modules:{
                            model:'icss'
                        }
                    }
                },'postcss-loader']
            },
            {
                test:cssModuleRegex,
                use: ['style-loader',{
                    loader:'css-loader',
                    options:{
                        modules:{
                            model:'local',
                            getLocalIdent: getCSSModuleLocalIdent,
                        }
                    }
                },'postcss-loader']
            },
            {
                test: sassRegex,
                exclude:sassModuleRegex,
                use: ['style-loader',{
                    loader:'css-loader',
                    options:{
                        modules:{
                            model:'icss'
                        }
                    }
                }, 'postcss-loader','sass-loader']
            },
            {
                test: sassModuleRegex,
                use: ['style-loader',{
                    loader:'css-loader',
                    options:{
                        modules:{
                            model:'local',
                            getLocalIdent: getCSSModuleLocalIdent,
                        }
                    }
                }, 'postcss-loader','sass-loader']
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
