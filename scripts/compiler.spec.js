import CompilerConfig from './compiler';
import Chalk from 'chalk';

jest.mock('./utils');
jest.mock('webpack');
jest.mock('webpack-dev-server');

const _console = Object.assign({}, global.console);
function mockConsole() {
  global.console = { log: jest.fn(), error: jest.fn(), warn: jest.fn() }
}

function unmockConsole() {
  global.console = Object.assign({}, _console);
}

function mockStats(errors, warnings) {
  this.toJson = () => ({
    errors: errors || [],
    warnings: warnings || [],
  })
};

describe('Scripts Start', () => {
  const Utils = require('./utils');
  beforeEach(() => {
    mockConsole();
  });

  afterEach(() => {
    unmockConsole();
    Utils.mockReset();
  })

  describe('#setupCompiler', () => {
    let compilerConfig;
    let webpack;

    describe('When setupCompiler is called with values', () => {
      beforeEach(() => {
        webpack = require('webpack');
        compilerConfig = new CompilerConfig({});
        compilerConfig.setupCompiler();
      })

      it('Setups Webpack compiler', () => {
        expect(webpack).toHaveBeenCalled();
      });

      // https://webpack.github.io/docs/plugins.html#invalid
      it('Setups a #invalid plugin', () => {
        expect(webpack().plugin).toHaveBeenCalledWith(
          'invalid', compilerConfig.invalidPlugin)
      });

      // https://webpack.github.io/docs/plugins.html#done
      it('Setups a #done plugin', () => {
        expect(webpack().plugin).toHaveBeenCalledWith(
          'done', compilerConfig.donePlugin)
      });

      it('Sets the port, host, and protocol to new values', () => {
        expect(compilerConfig.port).toBe(3000)
        expect(compilerConfig.protocol).toBe('https');
        expect(compilerConfig.host).toBe('localhost');
      })
    })
  })

  // https://webpack.github.io/docs/plugins.html#invalid
  describe('#invalidPlugin', () => {

    it('should log the fact that it is compiling', () => {
      const compilerConfig = new CompilerConfig({});
      compilerConfig.invalidPlugin();
      expect(console.log).toHaveBeenCalled();
    });

    describe('interactive state', () => {
      let compilerConfig
      beforeEach(() => {
        compilerConfig = new CompilerConfig({ interactive: true })
      });
      describe('when the compiler is set to interactive', () => {
        it('should clear console onload', () => {
          compilerConfig.invalidPlugin();
          expect(Utils.clearConsole).toHaveBeenCalled()
        });
      });

      describe('when the compiler is not set to interactive', () => {
        it('should not clear console onload', () => {
          compilerConfig.interactive = false;
          compilerConfig.invalidPlugin();
          expect(Utils.clearConsole).not.toHaveBeenCalled()
        });
      });
    });
  })

  describe('#donePlugin', () => {
    it('formats passed stats for cleaner Rendering', () => {
      const compilerConfig = new CompilerConfig();
      compilerConfig.donePlugin(new mockStats(
        ['you got an error'],
        ['you got a warning']))
      expect(Utils.formatWebpackMessages).toHaveBeenCalled();
    });

    describe('when interactive', () => {
      it('clears console if interactive', () => {
        const compilerConfig = new CompilerConfig({ interactive: true });
        compilerConfig.donePlugin(new mockStats());
        expect(Utils.clearConsole).toHaveBeenCalled();
      });
    });

    describe('when it is not interactive', () => {
      it('does clears console if interactive', () => {
        const compilerConfig = new CompilerConfig({});
        compilerConfig.donePlugin(new mockStats(['something']));
        expect(Utils.clearConsole).not.toHaveBeenCalled();
      });
    });

    describe('when not interactive and first time compiled', () => {
      it('shows the instructions', () => {
        const compilerConfig = new CompilerConfig({});
        compilerConfig.donePlugin(new mockStats());
        expect(console.log.mock.calls[0]).toEqual(['\nThe app is running at:\n'])
        expect(console.log.mock.calls[1]).toEqual(['   ' + Chalk.cyan("https://localhost:3000/")])
        expect(console.log.mock.calls[2]).toEqual([])
      })
    })
    describe('when there are errors', () => {
      it('should render the errors in red', () => {
        const compilerConfig = new CompilerConfig({});
        compilerConfig.donePlugin(new mockStats(['MockError', 'HatError'], []));
        expect(console.log.mock.calls[3]).toEqual([Chalk.red('Fail to compile.')]);
        expect(console.log.mock.calls[5]).toEqual([Chalk.red('Error in MockError')]);
        expect(console.log.mock.calls[7]).toEqual([Chalk.red('Error in HatError')]);
      })
    })
    describe('when there are warnings', () => {
      it('should render the errors in yellow', () => {
        const compilerConfig = new CompilerConfig({});
        compilerConfig.donePlugin(new mockStats([], ['MockWarning', 'HatWarning']));
        expect(console.log.mock.calls[3]).toEqual([Chalk.yellow('Compiled with warnings.')]);
        expect(console.log.mock.calls[5]).toEqual([Chalk.yellow('Warning in MockWarning')]);
        expect(console.log.mock.calls[7]).toEqual([Chalk.yellow('Warning in HatWarning')]);
      })
    })
  });

  describe('#runDevServer', () => {
    let WebpackDevServer;
    let compilerConfig;
    beforeEach(() => {
      WebpackDevServer = require('webpack-dev-server');
      compilerConfig = new CompilerConfig({
        paths: {
          appPublic: '/content/public',
        }
      });

    })
    it('runs the WebpackDevServer', () => {
      compilerConfig.setupCompiler();
      expect(compilerConfig.compiler).toBeDefined();
      compilerConfig.runDevServer();
      expect(WebpackDevServer).toHaveBeenCalledWith(compilerConfig.compiler, {
        compress: true,
        quiet: true,
        https: true,
        clientLogLevel: 'none',
        historyApiFallback: true,
        publicPath: '/public',
        contentBase: '/content/public',
        watchOptions: {
          ignored: /node_modules/
        },
        host: 'localhost',
        hot: true,
      });
    });

    it('setups up the compiler listener', () => {
      compilerConfig.setupCompiler();
      expect(compilerConfig.compiler).toBeDefined();
      compilerConfig.runDevServer();
      expect(WebpackDevServer().listen).toHaveBeenCalledWith(
        compilerConfig.port, compilerConfig.devListen)
    });
  });

  describe('#addMiddleware', () => {
    it('should have an addMiddleware function', () => {
      const compilerConfig = new CompilerConfig({});
      expect(typeof compilerConfig.applyMiddleware).toBe('function');
    })
  })

  describe('#devListener', () => {
    it('breaks on any errors', () => {
      const compilerConfig = new CompilerConfig({});
      compilerConfig.devListen("some err")
      expect(console.log).toHaveBeenCalledWith('some err');
    });

    it('clears console if config is interactive', () => {
      const compilerConfig = new CompilerConfig({ interactive: true });
      compilerConfig.devListen()
      expect(Utils.clearConsole).toHaveBeenCalled();
    }); 

    it('Informs user that server is starting', () => {
      const compilerConfig = new CompilerConfig();
      compilerConfig.devListen();
      expect(console.log).toHaveBeenCalledWith(Chalk.cyan('Starting the development server...'))
    })
  });
});