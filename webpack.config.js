const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const fs = require('fs');

const DEBUG = false;

const src = path.join(__dirname, 'src');
const dist = path.join(__dirname, 'dist');

const templates = [];

const HTML_EXTENSION = '.html';
const EMPTY_STRING = '';

const files = fs.readdirSync(src);
const htmlFiles = files.filter(el => path.extname(el) === HTML_EXTENSION);

const entry = {};

for (const file of htmlFiles) {
    if (DEBUG) {
        console.log(`Configuring: ${file}`);
        console.log(path.join(src, file));
    }

    const chunk = file.replace(HTML_EXTENSION, EMPTY_STRING);

    const template = new HtmlWebpackPlugin({
        template: path.resolve(src, file),
        inject: true,
        chunks: [chunk],
        filename: file
    });

    entry[chunk] = path.join(src, `${chunk}.ts`);

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
        filename: '[name].js',
        path: dist,
    },
    plugins: [
        new CleanWebpackPlugin(),
        ...templates
    ],
    devServer: {
        contentBase: dist,
        compress: true,
        port: 9000
    }
};
