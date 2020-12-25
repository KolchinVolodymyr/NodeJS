'use strict';

const Hapi = require('hapi');
const _ = require('lodash');

const config = {
    port: process.env.PORT || 8080,
    routes: {
        cors: {
            origin: ['*'],
            credentials: true
        }
    }
};

if (process.env.IS_RELEASE === 'false') config.host = 'localhost';

const server = new Hapi.server(config);

async function start() {
    // register plugins to server instance
    await server.register([
        {
            plugin: require('inert')
        },
        {
            plugin: require('@hapi/vision')
        },
        {
            plugin: require('@hapi/cookie')
        },
        // {
        //     plugin: require('./plugins/requestLifecycle')
        // },
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


