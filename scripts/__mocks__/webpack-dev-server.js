'use strict';

jest.genMockFromModule('webpack-dev-server');

const listen = jest.fn();

const WebpackDevServer = jest.fn().mockImplementation(() => ({
  listen: listen,
}))

module.exports = WebpackDevServer;
module.listen = listen;