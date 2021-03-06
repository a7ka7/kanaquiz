const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const autoprefixer = require('autoprefixer');
const precss = require('precss');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

module.exports = {
    context: __dirname,
    devtool: 'cheap-module-source-map',
    entry: [
        './src/index'
    ],
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: './dist/',
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: 'src/index.html',
            filename: '../index.html'
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress:{
                warnings: false
            },
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: function() {
                    return [autoprefixer, precss];
                }
            }
        }),
        new SWPrecacheWebpackPlugin( {
            cacheId: 'kana-quiz',
            filename: 'sw.js',
            maximumFileSizeToCacheInBytes: 4194304,
            minify: true,
            runtimeCaching: [{
                handler: 'cacheFirst',
                urlPattern: /\.(woff2|svg|ttf|eot|woff|html)$/,
            }],
        })
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['babel-loader']
            }, {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader', 'postcss-loader']
            }, {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            }, {
                test: /\.(png|jpg|svg|woff|woff2)?(\?v=\d+.\d+.\d+)?$/,
                loader: 'url-loader?limit=8192'
            }, {
                test: /\.(eot|ttf)$/,
                loader: 'file-loader'
            }
        ]
    }
};