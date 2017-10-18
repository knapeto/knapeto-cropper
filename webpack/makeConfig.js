// Modules
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');
var autoprefixer = require('autoprefixer');
var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var ABSOLUTE_BASE = path.normalize(path.join(__dirname, '..'));
var BUILD_DIR = path.join(ABSOLUTE_BASE, 'build');

// Constants
var devtools = process.env.NODE_ENV == 'production' ? 'source-map' : 'eval';
var loaders = {
    'css': 'css-loader',
    'less': 'less-loader'
};

/**
 * Configuration of webpack for production/develop
 *
 * @param   {boolean}   isDevelopment - Defined webpack configuration
 */
module.exports = function (isDevelopment = false) {

    const localDevelopment = isDevelopment || false;

    const entry = localDevelopment ? [
        'babel-polyfill',
        'react-hot-loader/patch',
        `webpack-dev-server/client?http://localhost:4242`,
        'webpack/hot/only-dev-server',
        path.join(ABSOLUTE_BASE, 'styles/main.less'),
        path.join(ABSOLUTE_BASE, 'scripts/bootstrap.js')
    ] : [
        path.join(ABSOLUTE_BASE, 'styles/main.less'),
        path.join(ABSOLUTE_BASE, 'scripts/bootstrap.js')
    ];

    function stylesLoaders() {
        if (!localDevelopment) {
            return [
                {
                    test: /\.css$/,
                    use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: ['css-loader']
                    }))
                },
                {
                    test: /\.less$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: ['css-loader', 'less-loader']
                    })
                }
            ];
        }
        return Object.keys(loaders).map(ext => {
            var prefix = 'css-loader!postcss-loader!';
            var extLoaders = prefix + loaders[ext];
            var loader = `style-loader!${extLoaders}`;
            return {
                loader: loader,
                test: new RegExp(`\\.(${ext})$`)
            }
        });
    }

    var _config = {
        cache: isDevelopment,
        devtool: devtools,
        entry: {
            main: entry
        },
        output: {
            path: BUILD_DIR,
            publicPath: '/',
            filename: '[name]-[hash].js',
            chunkFilename: '[name]-[chunkhash].js'
        },
        module: {
            rules: [
                {
                    enforce: "pre",
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loaders: ['react-hot-loader/webpack', 'babel-loader']
                },
                {
                    test: /\.(gif|jpg|png|woff|woff2|eot|ttf|svg|ico|mp4)$/,
                    use: 'url-loader?limit=10000'
                },
                {
                    test: /\.(eot|woff2?|ttf|svg)/i,
                    use: 'file?name=/assets/fonts/[name].[ext]'
                }
            ].concat(stylesLoaders())
        },
        plugins: (() => {
            var plugins = isDevelopment ? [
                new webpack.HotModuleReplacementPlugin()
            ] : [
                new webpack.LoaderOptionsPlugin({
                    minimize: true,
                    debug: false
                }),
                // Awesome compress (minify) plugin
                new CompressionPlugin({
                    asset: "[path]",
                    algorithm: "gzip",
                    regExp: /\.js$/
                }),

                // Source map for faster re-building
                new webpack.SourceMapDevToolPlugin({
                    filename: 'source.js.map'
                }),
                new webpack.optimize.UglifyJsPlugin()
            ];

            plugins.push(
                new CopyWebpackPlugin([
                    { from: 'assets', to: 'assets'}
                ]),
                new ExtractTextPlugin({
                    filename: "assets/styles/main.css?v=[hash]",
                    allChunks: true
                }),
                new webpack.LoaderOptionsPlugin({
                    options: {
                        postcss: [
                            autoprefixer({
                                browserslist: [
                                    'iOS 7',
                                    'last 2 version'
                                ]
                            })
                        ]
                    }
                }),
                new webpack.optimize.CommonsChunkPlugin({
                    name: 'vendors',
                    minChunks: function (module) {
                        return module.context && module.context.indexOf('node_modules') !== -1;
                    }
                }),
                new HtmlWebpackPlugin({
                    template: `index.html`,
                    filename: 'index.html',
                    inject: 'body',
                    minify: {
                        removeComments: true,
                        collapseWhitespace: true,
                        preserveLineBreaks: true,
                        conservativeCollapse: true
                    }
                })
            );
            return plugins;
        })(),

        resolve: {
            extensions: ['.js'],
            modules: ['scripts', 'node_modules']
        },

        devServer: {
            hot: true,
            inline: true,
            contentBase: BUILD_DIR,
            publicPath: '/'
        }
    }
    return _config;
};
