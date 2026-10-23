#!/usr/bin/env node
require('nocamel');
const axios = require('axios').default;
const crypto = require('crypto');

const axios_instance = argv => {
    argv.axios = axios.create({
        baseURL: argv['piston-url'],
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': crypto
                .create_hash('sha256')
                .update(argv['api-key'])
                .digest('hex'),
        },
    });

    return argv;
};

require('yargs')(process.argv.slice(2))
    .option('piston-url', {
        alias: ['u'],
        default: 'http://127.0.0.1:2000',
        desc: 'Piston API URL',
        string: true,
    })
    .option('api-key', {
        alias: ['k'],
        default: process.env['PISTON_API_KEY'],
        desc: 'Piston API key (sent as its SHA-256 hash)',
        demandOption: true,
        string: true,
    })
    .middleware(axios_instance)
    .scriptName('piston')
    .commandDir('commands')
    .demandCommand()
    .help()
    .wrap(72).argv;
