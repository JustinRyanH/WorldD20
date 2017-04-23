'use strict';

jest.genMockFromModule('webpack');

const pluginMock = jest.fn();

const Webpack = jest.fn().mockImplementation(() => ({
  plugin: pluginMock,
}))

module.exports = Webpack;