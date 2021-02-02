const User = require('../profile/schema');
const config = require('config');

exports.plugin = {
    name: 'settingCookie',
    version: '1.0.0',
    register: async function (server, options) {

        server.auth.strategy('session60', 'cookie', {
            cookie: {
                name: 'sid-example',
                ttl: 168 * 60 * 60 * 1000,
                // Don't forget to change it to your own secret password!
                password: config.get('passwordCookies'),
                // For working via HTTP in localhost
                isSecure: false
            },
            validateFunc: async (request, session) => {
                const user = await User.findById(session._id);
                if(!user) {
                    return { valid: false };
                } else {
                    return { valid: true, credentials: user };
                }
            }
        });
    }
};