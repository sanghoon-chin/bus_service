const path = require('path');
const fs = require('fs/promises');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        map: './src/map/index.ts',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.css$/i,
                use: [
                    "style-loader",
                    "css-loader"
                ],
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader'
            },
            {
                test: /\.(svg|eot|woff|woff2|ttf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        // options: {
                        //     outputPath: 'assets/fonts',
                        //     publicPath: '/assets/fonts'
                        // }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/map/index.html',
            filename: 'map.html',
            chunks: ['map'],
        }),
        new CopyPlugin({
            patterns: [
                { from: "src/assets", to: "assets" }
            ],
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src/')
        },
        extensions: ['.js', '.ts', '.css']
    },
    mode: 'development',
    devServer: {
        port: 5500
    },
    devtool: 'eval-cheap-source-map'
}