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
            plugin: require('hapi-auth-jwt2')
        }

    ]);
// bring your own validation function
    const validate = async function (decoded, request, h) {

        // do your checks to see if the person is valid
        // if (!people[decoded.id]) {
        //     return { isValid: false };
        // }
        // else {
            return { isValid: true };
        // }
    };
    server.auth.strategy('jwt', 'jwt',
        { key: 'NeverShareYourSecret', // Never Share your secret key
            validate  // validate function defined above
        });
    server.auth.default('jwt');
    //@hapi/cookie
    server.auth.strategy('session60', 'cookie', {
        cookie: {
            name: 'sid-example',
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
        ttl: 24 * 60 * 60 * 1000,     // One day
        isSecure: true,
        path: '/',
        encoding: 'base64json'
    });

    server.ext({
        type: 'onRequest',
        method: async function (request, h) {
            try {
                //await console.log('request.cookieAuth',request.cookieAuth);
                const user = await User.findById('5f5816b351c8d243ac929125');
                request.user = user;

            } catch (e) {
                console.log(e)
            }
            return h.continue;
        }
    });
    //routes:
    server.route([
        {
            method: "GET",
            path: "/2",
            config: { auth: false },
            handler: function(request, h) {
                return {text: 'Token not required'};
            }
        },
        {
            method: 'GET',
            path: '/restricted',
            options: {
                auth: {
                    strategy: 'jwt'
                }
            },
            handler: function(request, h) {
                 const response = h.response({text: 'You used a Token! desktop-hsg40jn:8080/restricted?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwibmFtZSI6IkFudGhvbnkgVmFsaWQgVXNlciIsImlhdCI6MTQyNTQ3MzUzNX0.KA68l60mjiC8EXaC2odnjFwdIDxE__iDu5RwLdN1F2A'});
                 response.header("Authorization", request.headers.authorization);
                 console.log('response.header',response.header.authorization);
                 return response;
            }
        },
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
                // console.log('request.auth',request.auth);
                return h.view('index',
                    {
                        title: 'Home',
                        isHome: true,
                        isAuthenticated: request.auth.isAuthenticated
                    },
                    {layout:'Layout'},
                    console.log('isHome: request.auth',request.auth)
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


