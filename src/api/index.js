'use strict';

const Hapi = require('hapi');
const Vision = require('@hapi/vision');
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

// register plugins to server instance
//     await server.register([
//         {
//             plugin: require('inert')
//         },
//         {
//             plugin: require('vision')
//         }
//         ])
    await server.register(Vision);

    //// view configuration
    //   const viewsPath = Path.resolve(__dirname, 'public', 'views')
    server.views({
        engines: {
            hbs: require('handlebars')
        },
        relativeTo: __dirname,
        helpersPath: './templates', //the directory that contains your template helpers
        partialsPath: './templates/partials',
        path: __dirname + '/templates', //the directory that contains your main templates
        layoutPath: './templates/layout', //the directory that contains layout templates
    });


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
