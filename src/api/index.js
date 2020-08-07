'use strict';

const Hapi = require('hapi');
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./users/service');
const varMiddleware = require('./middleware/variales')

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
        }
    ]);
    //Setting cookie
    server.state('session', {
        ttl: 24 * 60 * 60 * 1000,     // One day
        isSecure: true,
        path: '/',
        encoding: 'base64json'
    });

    server.ext({
        type: 'onRequest',
        method: async function (request, h) {
            try {
                const user = await User.findById('5f273f0833365d3314b8c1dd');
                request.user = user;
            } catch (e) {
                console.log(e)
            }
            return h.continue;
        }
    });

    //routes:
    await server.route([
        {
            method: 'GET',
            path: '/',
            //
            options: {
                state: {
                    parse: true,            //The parse option determines if cookies are parsed and stored in request.state.
                    failAction: 'error'     //The failAction options determines how cookie parsing errors will be handled.
                }
            },
            handler: function async (request, h) {
                h.state('session', {
                    ttl: 24 * 60 * 60 * 1000,
                    encoding: 'base64json',
                });
                console.log(request.state.data);
                return h.view('index',
                    {
                        title: 'Home',
                        isHome: true
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
        const candidate = await User.findOne()
        if(!candidate) {
            const user = new User({
                email: 'Volodymyr@gmail.com',
                name: 'Volodymyr',
                cart: { items: []}
            })
            await user.save();

        }

        server.start();
        console.log('Server running at:', server.info.uri);
    } catch (e) {
        console.error('Cannot run server', e);
    }
}


// if you need required some other Promise response data, please use next call at the end of the init call, for e.g.:
// someCall().then(start);
start();


