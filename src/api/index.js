'use strict';

const Hapi = require('hapi');
const _ = require('lodash');
const path = require('path');

const config = {
    port: process.env.PORT || 8080,
    routes: {
        cors: {
            origin: ['*'],
            credentials: true
        },
        files: {
            relativeTo: path.join(__dirname, 'public')
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
        {
            plugin: require('./plugins/requestLifecycle')
        },
        {
            plugin: require('./plugins/settingCookie')
        },
        {
            plugin: require('./plugins/connectMongoose')
        },
        {
            plugin: require('./plugins/servingStaticFiles')
        },
        {
            plugin: require('./plugins/loadAllRoutes')
        }
        // {
        //     plugin: require('./plugins/layoutHandlebars')
        // }

    ]);

    server.route([
        {
            method: 'GET',
            path: '/',
            options: {
                handler: (request, h) => {
                    //console.log('request.auth4', request.auth);
                    return h.response({
                        autorization: request.headers.autorization,
                        token: request.headers.cookie,
                        id: request.auth.credentials._id
                    })
                }
            }
        }
    ]);


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


