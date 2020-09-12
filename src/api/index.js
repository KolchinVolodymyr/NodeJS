'use strict';

const Hapi = require('hapi');
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./users/service');
const bcrypt = require('bcryptjs');

const users = [
    {
        username: 'john',
        password: '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm',   // 'secret'
        name: 'John Doe',
        id: '2133d32a'
    }
];

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
            plugin: require('hapi-auth-bearer-token')
        }

    ]);

    //@hapi/cookie
    server.auth.strategy('session60', 'cookie', {
        cookie: {
            name: 'sid-example',
            password: '!wsYhFA*C2U6nz=Bu^%A@^F#SF3&kSR6',
            isSecure: false
        },
        redirectTo: '/login',
        validateFunc: async (request, session) => {
            return { valid: true , credentials: session };
        }
    });
    server.auth.default('session60');
    //Setting cookie
    server.state('session60', {
        ttl: 24 * 60 * 60 * 1000,     // One day
        isSecure: true,
        path: '/',
        encoding: 'base64json'
    });

    //routes:
    server.route([
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
                h.state('session60', {
                    ttl: 24 * 60 * 60 * 1000,
                    encoding: 'base64json',
                });
                // console.log('request.auth',request.auth);
                return h.view('index',
                    {
                        title: 'Home',
                        isHome: true,
                        isAuthenticated: request.auth.isAuthenticated
                    },
                    {layout:'Layout'}
                )
            }
        },
        {
            method: 'GET',
            path: '/login',
            handler: function (request, h) {

                return ` <html>
                            <head>
                                <title>Login page</title>
                            </head>
                            <body>
                                <h3>Please Log In</h3>
                                <form method="post" action="/login">
                                    Username: <input type="text" name="username"><br>
                                    Password: <input type="password" name="password"><br/>
                                <input type="submit" value="Login"></form>
                            </body>
                        </html>`;
            },
            options: {
                auth: false
            }
        },
        {
            method: 'POST',
            path: '/login',
            handler: async (request, h) => {

                const { username, password } = request.payload;
                const account = users.find(
                    (user) => user.username === username
                );

                if (!account || !(await bcrypt.compare(password, account.password))) {

                    return h.view('/login');
                }

                request.cookieAuth.set(account);

                return h.redirect('/');
            },
            options: {
                auth: {
                    mode: 'try'
                }
            }
        },
        {
            method: 'GET',
            path: `/logout`,
            handler: async function (request, h) {
                request.cookieAuth.clear();
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


