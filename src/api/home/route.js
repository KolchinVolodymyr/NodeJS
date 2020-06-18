'use strict';

const MODEL_NAME = 'home';

module.exports = [
    {
        method: 'GET',
        path: `/${MODEL_NAME}`,
        handler: (request, reply) => {
            return reply.response({key: "home value"});
        }
    }
];