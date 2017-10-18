// Modules
var http = require('http');
var express = require('express');
var webpack = require('webpack');
var path = require('path');
var WebpackDevServer = require("webpack-dev-server");

// Configs
var webpackConfig = require('./makeConfig');
var _devConfig = webpackConfig(true);
var compiler = webpack(_devConfig);
var app = express();
var port = 4242;
var host = 'localhost';

var config = {
	contentBase: `scripts`,
	historyApiFallback: true,
	// Set this if you want to enable gzip compression for assets
	compress: true,
	hot: true,
	publicPath: _devConfig.output.publicPath,
	watchOptions: {
        ignored: /node_modules/
    },
	stats: {
		colors: true,
		hash: false,
		timings: true,
		chunks: false,
		chunkModules: false,
		modules: false
	}
};

var server = new WebpackDevServer(compiler, config);
server.listen(port, "localhost", function (err) {
	if (err) {
		console.log(err);
	}
	console.info('----\n==> ✅  App is running');
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', host, port);
});
