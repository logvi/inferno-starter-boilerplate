const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HTML = require('html-webpack-plugin');

const out = path.resolve(__dirname, 'assets');
const jsPath = path.resolve(__dirname, 'src', 'js');
const stylePath = path.resolve(__dirname, 'src', 'styles');

module.exports = {
    entry: {
        app: './src/js/bootstrap.js',
        vendor: ['inferno']
    },
    output: {
        path: out,
        filename: 'js/[name].bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            include: jsPath,
            loader: 'babel-loader',
            options: {
                presets: [
                    ['es2015', {loose: true, modules: false}],
                    'stage-0'
                ],
                plugins: ["babel-plugin-syntax-jsx", ["babel-plugin-inferno", {"imports": true}]]
            }
        }, {
            test: /\.scss$/,
            include: stylePath,
            loader: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader!postcss-loader!sass-loader'
            })
        }]
    },
    plugins: [
        // split vendor chunks
        new webpack.optimize.CommonsChunkPlugin({name: 'vendor'}),

        // build css into separate file
        new ExtractTextPlugin({
            filename: 'style/main.css',
            allChunks: true
        }),

        // postcss config
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [
                    require('autoprefixer')({
                        browsers: ['last 3 version']
                    })
                ]
            }
        }),

        // HTML
        new HTML({
            template: './src/index.html',
            filename: 'index.html',
            inject: false,
            hash: true
        }),
    ],
    devServer: {
        historyApiFallback: true,
        contentBase: out,
        publicPath: "/",
        port: 3000
    },
};