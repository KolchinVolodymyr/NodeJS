"use strict";

const Hapi = require('hapi');

module.exports = (async function() {
    const server = await new Hapi.Server({
        host: "localhost",
        port: 8080,
        routes: {
            cors: {
                origin: ['*'],
                credentials: true
            }
        }
    });

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


    try {
        server.start();
        console.log('Server running at:', server.info.uri);
    } catch (e) {

        console.error('Cannot run server', e);
    }
})();