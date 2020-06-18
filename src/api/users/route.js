'use strict';

const MODEL_NAME = 'users';

const service = require('./service');

module.exports = [
    {
        method: 'GET',
        path: `/${MODEL_NAME}`,
        handler: async (request, reply) => {

            return reply.response(await service.getAll());
        }
    },

    {
        method: 'GET',
        path: `/${MODEL_NAME}/{id}`,
        handler: async (request, reply) => {

            const {id} = request.params;

            // return service.getById(id)
            //     .then(data => reply.response(data))
            //     .catch(reply.response);

            try {
                return reply.response(await service.getById(id));
            } catch (e) {
                reply.error(e);
            }
        }
    },


    {
        method: 'POST',
        path: `/${MODEL_NAME}`,
        handler: async (request, reply) => {
            try {
                return reply.response(await service.create(request.payload));
            } catch (e) {
                reply.response(e);
            }
        }
    }
];