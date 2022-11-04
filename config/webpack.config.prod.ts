import  {resolve} from "path";
import * as CompressionPlugin from 'compression-webpack-plugin'
import * as CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import * as TerserWebpackPlugin from 'terser-webpack-plugin'
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'
import * as CopyWebpackPlugin from 'copy-webpack-plugin'
const common = require('./webpack.config.common')
import {merge} from 'webpack-merge'
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
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
            },
            {
                test: /\.s[ac]ss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
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
