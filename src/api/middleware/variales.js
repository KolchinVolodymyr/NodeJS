const User = require('../users/service');

exports.plugin = {
    name: 'getDate',
    version: '1.0.0',
    register:function (server, options) {
        // server.ext({
        //     type: 'onRequest',
        //     //type: 'onCredentials',
        //     method: async function (request, h) {
        //         const id = request.auth.credentials;
        //         request.user = id;
        //          console.log('onRequest request.user',request.user);
        //          console.log('onRequest  request.auth', request.auth);
        //         return h.continue;
        //     }
        // });
        // server.ext({
        //     type: 'onCredentials',
        //     method: async function (request, h) {
        //         try {
        //             request.user = request.auth.credentials;
        //             console.log('onCredentials request.user',request.user);
        //             return h.continue;
        //         } catch (e) {
        //             console.log(e)
        //         }
        //
        //     }
        // });

    }
};