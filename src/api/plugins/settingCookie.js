const User = require('../users/service');

exports.plugin = {
    name: 'settingCookie',
    version: '1.0.0',
    register: async function (server, options) {

        server.auth.strategy('session60', 'cookie', {
            cookie: {
                name: 'sid-example',
                ttl: 168 * 60 * 60 * 1000,
                // Don't forget to change it to your own secret password!
                password: 'password-should-be-32-characters',

                // For working via HTTP in localhost
                isSecure: false
            },
            validateFunc: async (request, session) => {
                const user = await User.findById( session._id);
                if(!user) {
                    console.log('user не найдено');
                    return { valid: false };
                } else {
                    console.log('все ок');
                    return { valid: true, credentials: user };
                }
            }
        });

        //routes:
        server.auth.default('session60');

    }
};