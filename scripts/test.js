'use strict';

process.env.NODE_ENV = 'test';
process.env.PUBLIC_URL = '';

require('dotenv').config({silent: true});

const Jest = require('jest');
const argv = process.argv.slice(2);

if (!process.env.CI && argv.indexOf('--coverage') < 0) {
	argv.push('--watch');
}

Jest.run(argv);