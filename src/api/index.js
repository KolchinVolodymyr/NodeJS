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
            plugin: require('./plugins/hapiFlash')
        },
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
        //     plugin: require('./plugins/emailPostmark')
        // },
        // {
        //     plugin: require('./plugins/layoutHandlebars')
        // }

    ]);

    //routes:
    server.route([
        {
            method: 'GET',
            path: '/',
            options: {
                auth: {
                    mode: 'try',
                    strategy: 'session60'
                }
            },
            handler:async function (request, h) {
                h.state('session60', {
                    ttl: 24 * 60 * 60 * 1000,
                    encoding: 'base64json',
                });
                return h.view('index',
                    {
                        title: 'Home',
                        isHome: true,
                        isAuthenticated: request.auth.isAuthenticated
                    },
                    {layout:'Layout'}
                )
            }
        }
    ]);
    // console.log('__dirname',__dirname);
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


