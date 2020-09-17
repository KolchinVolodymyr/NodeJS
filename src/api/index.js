'use strict';

const Hapi = require('hapi');
const _ = require('lodash');
const path = require('path');
const User = require('../api/users/service');
const mongoose = require('mongoose');


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
            plugin: require('../api/middleware/variales')
        }

    ]);

    //@hapi/cookie
    server.auth.strategy('session60', 'cookie', {
        cookie: {
            name: 'sidExample',
            ttl: 168 * 60 * 60 * 1000,
            password: '!wsYhFA*C2U6nz=Bu^%A@^F#SF3&kSR6',
            isSecure: false
        },
        redirectTo: false,
        validateFunc: async (request, session) => {

            return { valid: true , credentials: session };
        }
    });

    //Setting cookie
    server.state('session60', {
        ttl: 168 * 60 * 60 * 1000,     // One day
        isSecure: true,
        path: '/',
        encoding: 'base64json',
    });

    server.ext({
        type: 'onCredentials',
        method: async function (request, h) {
            try {
                const cookie = request.headers.cookie || '',
                    token = cookie.split(/;+/).filter((str)=>{
                        return str.indexOf('sidExample') ===0
                    }),
                    authorization = _.get(token, '0', ''),
                    parts = authorization.split(/=+/);
                if(parts[1]) {
                    request.headers['autorization'] = `Bearer ${parts[1]}`;
                }
                return h.continue;
            } catch (e) {
                console.log(e)
            }

        }
    });

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
            handler: function async (request, h) {
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
    //Serving Static Files
    await server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: '.',
                redirectToSlash: true
            }
        }
    });

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
        await mongoose.connect(url,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });

        server.start();
        console.log('Server running at:', server.info.uri);
    } catch (e) {
        console.error('Cannot run server', e);
    }
}


// if you need required some other Promise response data, please use next call at the end of the init call, for e.g.:
// someCall().then(start);
start();


