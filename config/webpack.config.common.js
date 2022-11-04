const ProgressBarPlugin  = require('progress-bar-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {existsSync} = require('fs')
const {resolve} = require('path')
const webpack = require('webpack')
const dotenv = require('dotenv')
const chalk = require('chalk')
const envFile = resolve(__dirname, `../.env.${process.env.NODE_ENV}`)
const result = dotenv.config({
    path: existsSync(envFile) ? envFile : resolve(__dirname, '../.env.development')
})
if (result.error) throw result.error
module.exports = {
    entry: {
        app: resolve(__dirname, '../src/index.tsx')
    },
    output: {
        publicPath: '/',
        assetModuleFilename: 'images/[name].[hash:8][ext]',
        clean: true
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, '../src')
        },
        extensions: ['.ts', '.tsx', '.jsx', '.d.ts', '...']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: resolve(__dirname, '../public/index.html'),
            inject: 'body',
            filename: 'index.html',
            scriptLoading: 'defer',
            title: 'Chu-Ting'
        }),
        new ProgressBarPlugin({
            format: ` build [:bar] ${chalk.green.bold(':percent')} (:elapsed seconds)`
        } ),
        new webpack.DefinePlugin({
            process: {
                env: {...result.parsed}
            }
        })
    ],
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                        type: 'asset',
                        generator: {
                            filename: 'media/[name].[hash:8][ext]'
                        }
                    },
                    {
                        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
                        type: 'asset',
                        generator: {
                            filename: 'fonts/[name].[hash:8][ext]'
                        }
                    },
                    {
                        test: /\.(png|jpe?g|gif|webp|avif)(\?.*)?$/,
                        type: 'asset',
                        parser: {
                            dataUrlCondition: {
                                maxSize: 10 * 1024
                            }
                        }
                    },
                    {
                        test: /\.(svg)(\?.*)?$/,
                        type: 'asset/resource'
                    }
                ]
            },
        ]
    }
}
