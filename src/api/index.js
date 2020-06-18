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
    //routes:
    server.route([
        {
            method: 'GET',
            path: '/',
            handler: (request, reply) => {
                logger.info('Test Message');

                return reply.response({key: "some value"});
            }
        }
    ]);

    // load all routes:
    const routeModules = require('./routesFetcher');
    server.route(routeModules);

    try {
        server.start();
        console.log('Server running at:', server.info.uri);
    } catch (e) {
        console.error('Cannot run server', e);
    }
}


// if you need required some other Promise response data, please use next call at the end of the init call, for e.g.:
// someCall().then(start);
start();
