'use strict';

var path = require('path');
var fs = require('fs');
var url = require('url');

var appDirectory = fs.realpathSync(process.cwd());

function resolveApp(relativePath) {
	return path.resolve(appDirectory, relativePath);
};

var nodePaths = (process.env.NODE_PATH || '')
	.split(process.platform === 'win32' ? ';' : ':')
	.filter(Boolean)
	.filter(folder => !path.isAbsolute(folder))
	.map(resolveApp);

const resolvedPaths = [
  resolveApp('./src'),
  "node_modules",
]

module.exports = {
  appSrc: resolveApp('src'),
  appBuild: resolveApp('dist'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndex: resolveApp('src/index.tsx'),
  resolvedPaths,
}