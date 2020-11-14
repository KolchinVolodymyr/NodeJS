
const path = require('path');

exports.plugin = {
    name: 'servingStaticFiles',
    version: '1.0.0',
    register: async function (server, options) {
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
        },
        {
            method: 'GET',
            path: '/public/{param*}',
            handler: {
                directory: {
                    path: path.join(__dirname, 'public')
                }
            }
        },
        {
            method: 'GET',
            path: '/upload/{param*}',
            handler: {
                directory: {
                    path: path.join(__dirname, 'public/upload')
                }
            }
        });

    }
};