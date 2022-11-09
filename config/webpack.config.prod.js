const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const common = require('./webpack.config.common')
const {merge} = require('webpack-merge')
const {resolve} = require('path')
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')
module.exports = merge(common,{
    output: {
        path: resolve(__dirname, '../dist'),
        filename: 'js/[name].[contenthash:8].js',
        chunkFilename: 'js/[name].[contenthash:8].js'
    },
    plugins: [
        new CompressionPlugin({
            algorithm: 'gzip',
            threshold: 10240,
            minRatio: 0.8
        })
    ],
    optimization: {
        minimizer: [
            new CssMinimizerPlugin({
                parallel: true,
                minimizerOptions: {
                    preset: [
                        'default',
                        {
                            mergeLonghand: false,
                            cssDeclarationSorter: false
                        }
                    ]
                }
            }),
            new TerserWebpackPlugin({
                terserOptions: {
                    compress: {
                        arrows: false,
                        collapse_vars: false,
                        comparisons: false,
                        computed_props: false,
                        hoist_funs: false,
                        hoist_props: false,
                        hoist_vars: false,
                        inline: false,
                        loops: false,
                        negate_iife: false,
                        properties: false,
                        reduce_funcs: false,
                        reduce_vars: false,
                        switches: false,
                        toplevel: false,
                        typeofs: false,
                        booleans: true,
                        if_return: true,
                        sequences: true,
                        unused: true,
                        conditionals: true,
                        dead_code: true,
                        evaluate: true,
                        drop_console: true,
                        drop_debugger: true
                    },
                    mangle: {
                        safari10: true
                    }
                },
                parallel: true,
                extractComments: false
            }),
            new MiniCssExtractPlugin({
                filename: 'css/[name].[contenthash:8].css',
                chunkFilename: 'css/[name].[contenthash:8].css'
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: resolve(__dirname, '../public/'),
                        to: resolve(__dirname, '../dist'),
                        toType: 'dir',
                        noErrorOnMissing: true,
                        globOptions: {
                            ignore: ['**/.DS_Store', '**/index.html']
                        },
                        info: {
                            minimized: true
                        }
                    }
                ]
            })
        ]
    },
    devtool: 'nosources-source-map',
    mode: 'production',
    module: {
        rules: [
            {
                test: cssRegex,
                exclude:cssModuleRegex,
                use: [MiniCssExtractPlugin.loader, {
                    loader:'css-loader',
                    options:{
                        modules:{
                            model:'icss'
                        }
                    }
                }, 'postcss-loader']
            },
            {
                test:cssModuleRegex,
                use: [MiniCssExtractPlugin.loader, {
                    loader:'css-loader',
                    options:{
                        modules:{
                            model:'local',
                            getLocalIdent:getCSSModuleLocalIdent
                        }
                    }
                }, 'postcss-loader']
            },
            {
                test:sassRegex,
                exclude:sassModuleRegex,
                use: [MiniCssExtractPlugin.loader, {
                    loader:'css-loader',
                    options:{
                        modules:{
                            model:'icss'
                        }
                    }
                }, 'postcss-loader', 'sass-loader']
            },
            {
                test:sassModuleRegex,
                use: [MiniCssExtractPlugin.loader, {
                    loader:'css-loader',
                    options:{
                        modules:{
                            model:'local',
                            getLocalIdent:getCSSModuleLocalIdent
                        }
                    }
                }, 'postcss-loader', 'sass-loader']
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    'thread-loader',
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
                    'thread-loader',
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
})
