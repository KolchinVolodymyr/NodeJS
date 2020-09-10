'use strict';

const Hapi = require('hapi');
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./users/service');
const bcrypt = require('bcryptjs');

const users = {
    john: {
        username: 'john',
        password: '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm',   // 'secret'
        name: 'John Doe',
        id: '2133d32a'
    }
};

const validate = async (request, username, password) => {

    const user = users[username];
    if (!user) {
        return { credentials: null, isValid: false };
    }

    const isValid = await bcrypt.compare(password, user.password);
    const credentials = { id: user.id, name: user.name };
    return { isValid, credentials };
};

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
            plugin: require('@hapi/basic')
        }

    ]);
    server.auth.strategy('simple', 'basic', { validate });

    server.route({
        method: 'GET',
        path: '/2',
        options: {
            auth: 'simple'
        },
        handler: function (request, h) {
            return 'welcome';
        }
    });
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
                const user = await User.findById('5f5816b351c8d243ac929125');
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
                //console.log(isAuth);
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

        const candidate = await User.findOne();

        if(!candidate) {
            const user = new User({
                email: 'Volodymyr@gmail.com',
                name: 'Volodymyr',
                password: 'hashPassword',
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


