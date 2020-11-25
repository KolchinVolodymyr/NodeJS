const User = require('../users/service');

exports.plugin = {
    name: 'settingCookie',
    version: '1.0.0',
    register: async function (server, options) {
        //Setting cookie
         await server.state('session60', {
            ttl: 168 * 60 * 60 * 1000,     // One day
            isSecure: true,
            path: '/',
            encoding: 'base64json',
        });


        //@hapi/cookie
        await server.auth.strategy('session60', 'cookie', {
            cookie: {
                name: 'sidExample',
                ttl: 168 * 60 * 60 * 1000,
                password: '!wsYhFA*C2U6nz=Bu^%A@^F#SF3&kSR6',
                isSecure: false
            },
            redirectTo: '/login',
            validateFunc: async (request, session) => {

                return { valid: true , credentials: session };
            }
        });


        // await server.register(AuthBearer);
        //
        // server.auth.strategy('session60', 'bearer-access-token', {
        //     allowQueryToken: true,              // optional, false by default
        //     validate: async (request, token, h) => {
        //
        //         // here is where you validate your token
        //         // comparing with token from your database for example
        //         const isValid = token === '1234';
        //
        //         const credentials = { token };
        //         const artifacts = { test: 'info' };
        //
        //         return { isValid, credentials, artifacts };
        //     }
        // });



        // const validate = async function (decoded, request, h) {
        //
        //     // do your checks to see if the person is valid
        //     if (!User[decoded.id]) {
        //         return { isValid: false };
        //     }
        //     else {
        //         return { isValid: true };
        //     }
        // };
        // await server.register(require('hapi-auth-jwt2'));
        // server.auth.strategy('session60', 'jwt',
        //     { key: 'NeverShareYourSecret', // Never Share your secret key
        //         validate  // validate function defined above
        //     });
        //
        // server.auth.default('session60');

    }
};