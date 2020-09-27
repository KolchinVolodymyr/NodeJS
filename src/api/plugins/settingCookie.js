

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

    }
};