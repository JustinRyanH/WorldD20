// React Dev Utils

const GLOBAL_UTILS = {
  prompt: jest.fn(),
  openBrowser: jest.fn(),
  clearConsole: jest.fn(),
  checkRequiredFiles: jest.fn(),
  formatWebpackMessages: jest.fn(json => require('react-dev-utils/formatWebpackMessages')(json)),
  getProcessForPort: jest.fn(),
}

function mockReset() {
  Object.keys(GLOBAL_UTILS).forEach(function (k) {
    switch(k) {
      case 'formatWebpackMessages':
        GLOBAL_UTILS[k] = jest.fn(json => require('react-dev-utils/formatWebpackMessages')(json))
        break;
      default:
        GLOBAL_UTILS[k].mockReset();
    }
  })
}

exports.prompt = GLOBAL_UTILS.prompt;
exports.clearConsole = GLOBAL_UTILS.clearConsole;
exports.checkRequiredFiles = GLOBAL_UTILS.checkRequiredFiles;
exports.formatWebpackMessages = GLOBAL_UTILS.formatWebpackMessages;
exports.getProcessForPort = GLOBAL_UTILS.getProcessForPort;
exports.mockReset = mockReset;