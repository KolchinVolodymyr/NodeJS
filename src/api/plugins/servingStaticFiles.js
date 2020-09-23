

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
        });

    }
};