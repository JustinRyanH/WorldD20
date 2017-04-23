'use strict';

process.env.NOVE_ENV = 'development';

require('dotenv').config({silent: true});

const chalk = require('chalk');
const detect = require('detect-port');


// Utils
const Utils = require('./utils');
const CompilerConfig = require('./compiler').default;

// Local Configuration
const config = require('../config/webpack.config.dev');
const paths = require('../config/paths');


// Global defined Variables
const isInteractive = process.stdout.isTTY;
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
let compilerConfig;

if (!Utils.checkRequiredFiles([paths.appHtml, paths.appIndex])) {
	process.exit(1);
}


const addMiddleware = (devServer) => {
 // const proxy = require(paths.appPackageJson).proxy;
}

const run = (port) => {
  compilerConfig = new CompilerConfig({
    port: port,
    host: process.env.host || 'localhost',
    protocol: process.env.HTTPS === true ? 'https' : 'http',
    interactive: isInteractive,
    paths: paths,
    config: config,
  });
 compilerConfig.setupCompiler();
 compilerConfig.runDevServer();
}

detect(DEFAULT_PORT).then(port => {
 if (port === DEFAULT_PORT) {
   run(port);
   return;
 }

 if (isInteractive) {
   Utils.clearConsole();
   const existingProcess = Utils.getProcessForPort(DEFAULT_PORT);

   const question = chalk.yellow(
     `Something is already running on ${DEFAULT_PORT}. Probably ${existingProcess}
     \nWould you like to run the app on another port instead?`);

   Utils.prompt(question, true).then(shouldChangePort => {
     if (shouldChangePort) {
       run(port);
     }
   });
 }
}).catch(err => {
  console.log(chalk.red(`Something bad has happened:\n${err}\n`));
  process.exit(2);
}) 
