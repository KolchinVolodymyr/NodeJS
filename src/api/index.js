'use strict';

const Hapi = require('@hapi/hapi');
const _ = require('lodash');
const config = require('config');

const сonfigure = {
    port: config.get('port') || 8000,
    routes: {
        cors: {
            origin: ['*'],
            credentials: true
        }
    }
};

const server = new Hapi.server(сonfigure);

async function start() {
    // register plugins to server instance
    await server.register([
        {
            plugin: require('@hapi/cookie')
        },
        {
            plugin: require('./plugins/settingCookie')
        },
        {
            plugin: require('./plugins/connectMongoose')
        },
        {
            plugin: require('./plugins/loadAllRoutes')
        }
    ]);


    try {
        server.start();
        console.log('Server running at:', server.info.uri);
    } catch (e) {
        console.error('Cannot run server', e);
    }
}


//
start();


