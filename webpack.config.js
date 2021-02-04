const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const fs = require('fs');
const webpack = require('webpack');

const DEBUG = false;

const srcPages = path.join(__dirname, 'src/pages');
const srcTS = path.join(__dirname, 'src/ts');
const dist = path.join(__dirname, 'dist');

const templates = [];

const HTML_EXTENSION = '.html';
const EMPTY_STRING = '';

const files = fs.readdirSync(srcPages);
const htmlFiles = files.filter(el => path.extname(el) === HTML_EXTENSION);

const entry = {};

for (const file of htmlFiles) {
    if (DEBUG) {
        console.log(`Configuring: ${file}`);
        console.log(path.join(srcPages, file));
    }

    const chunk = file.replace(HTML_EXTENSION, EMPTY_STRING);

    const template = new HtmlWebpackPlugin({
        template: path.resolve(srcPages, file),
        inject: true,
        chunks: [chunk],
        filename: file
    });

    entry[chunk] = path.join(srcTS, `${chunk}.ts`);

    templates.push(template);
}

if (DEBUG) {
    console.log(entry);
    console.log(templates)
}

module.exports = {
    // mode: 'production',
    mode: 'development',
    entry,
    // devtool: 'inline-source-map',
    devtool: false,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        // filename: 'bundle.js',
        filename: '[name].[chunkhash].js',
        path: dist,
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all"
                }
            }
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        ...templates,
        new webpack.DefinePlugin({
            "__VUE_OPTIONS_API__": true,
            "__VUE_PROD_DEVTOOLS__": false,
        })
    ],
    devServer: {
        contentBase: dist,
        compress: true,
        port: 9000
    }
};
