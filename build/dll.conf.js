const webpack = require('webpack');
var path = require('path');
var projectRoot = path.resolve(__dirname, '../');

const vendors = [
    'react',
    'react-dom',
    'react-router',
    'axios',
    'dva',
    'dva-loading',
    'classnames',
    'antd',
    'underscore',
    'moment',
    'prop-types'
];

module.exports = {
    output: {
        path: projectRoot + '/externals',
        filename: '[name].js',
        library: '[name]',
    },
    entry: {
        "lib": vendors,
    },
    plugins: [
        new webpack.DllPlugin({
            path: projectRoot + '/externals/manifest.json',
            name: '[name]',
            context: projectRoot,
        })
    ],
};