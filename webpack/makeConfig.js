// Modules
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
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

    const localDevelopment = true;

    const entry = [
        'babel-polyfill',
        'react-hot-loader/patch',
        `webpack-dev-server/client?http://localhost:4242`,
        'webpack/hot/only-dev-server',
        path.join(ABSOLUTE_BASE, 'styles/main.less'),
        path.join(ABSOLUTE_BASE, 'scripts/bootstrap.js')
    ];

    function stylesLoaders() {
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
        plugins: [
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
            new webpack.HotModuleReplacementPlugin(),
            new ExtractTextPlugin({
                filename: "assets/styles/main.css?v=[hash]",
                allChunks: true
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
        ],

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
