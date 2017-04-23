const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const Chalk = require('chalk');
const Utils = require('./utils');


Object.defineProperty(exports, "__esModule", {
  value: true
});

function CompilerConfig (options) {
  const defaultOptions = {
    config: {
      output: {
        publicPath: '/public',
      }
    },
    paths: {},
    interactive: false,
    handleCompile: null,
    protocol: 'https',
    port: 3000,
    host: 'localhost',
  };

  const opts = Object.assign(defaultOptions, options);
  this.config = opts.config;
  this.handleCompile = opts.handleCompile;
  this.interactive = opts.interactive;
  this.paths = opts.paths

  this.firstCompile = true;
  this.port = opts.port;
  this.protocol = opts.protocol;
  this.host = opts.host;

  this.invalidPlugin = () => {
    if (this.interactive) {
      Utils.clearConsole();
    }
    console.log("Compiling...");
  };

  this.donePlugin = (stats) => {
    if (this.interactive) {
      Utils.clearConsole();
    }
    const messages = Utils.formatWebpackMessages(stats.toJson({}, true));
    const showInstructions = (this.interactive || this.firstCompile)
    if (showInstructions) {
      console.log('\nThe app is running at:\n')
      console.log('   ' + Chalk.cyan(`${this.protocol}://${this.host}:${this.port}/`))
      console.log();
    };
    if (messages.errors.length) {
      console.log(Chalk.red('Fail to compile.'));
      console.log();
      messages.errors.forEach(message => {
        console.log(Chalk.red(message))
        console.log();
      })
    };
    if (messages.warnings.length) {
      console.log(Chalk.yellow('Compiled with warnings.'))
      console.log();
      messages.warnings.forEach(message => {
        console.log(Chalk.yellow(message));
        console.log();
      })
    }
  };

  this.devListen = (err) => {
    if (err) {
      return console.log(err);
    }

    if (this.interactive) {
      Utils.clearConsole();
    }
    console.log(Chalk.cyan('Starting the development server...'));
    console.log();
  };
};

CompilerConfig.prototype.setupCompiler = function () {
  this.compiler = Webpack(this.config, this.handleCompile)
  this.compiler.plugin('invalid', this.invalidPlugin)
  this.compiler.plugin('done', this.donePlugin)
};

CompilerConfig.prototype.runDevServer = function () {
  if (!this.compiler) {
    return process.exit(2);
  }
  this.devServer = new WebpackDevServer(this.compiler, {
    compress: true,
    clientLogLevel: 'none',
    contentBase: this.paths.appPublic,
    hot: true,
    historyApiFallback: true,
    publicPath: this.config.output.publicPath,
    quiet: true,
    watchOptions: {
      ignored: /node_modules/
    },
    https: this.protocol === "https",
    host: this.host
  });

  this.devServer.listen(this.port, this.devListen);
}

CompilerConfig.prototype.applyMiddleware = function() {};

exports.default = CompilerConfig;