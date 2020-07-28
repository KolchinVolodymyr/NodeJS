'use strict';

const Hapi = require('hapi');
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');

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
    await server.register([
        {
            plugin: require('inert')
        },
        {
            plugin: require('@hapi/vision')
        }
    ])

    // view configuration
    //const viewsPath = path.resolve(__dirname, 'public', 'views');


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
        //connect BD
        const url =`mongodb+srv://admin:380990302581@cluster0.eufzr.mongodb.net/shop`
        await mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true,  useFindAndModify: false});

        server.start();
        console.log('Server running at:', server.info.uri);
    } catch (e) {
        console.error('Cannot run server', e);
    }
}


// if you need required some other Promise response data, please use next call at the end of the init call, for e.g.:
// someCall().then(start);
start();
