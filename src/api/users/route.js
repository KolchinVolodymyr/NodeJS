'use strict';

const MODEL_NAME = 'users';

const service = require('./service');

module.exports = [
    {
        method: 'GET',
        path: `/${MODEL_NAME}`,
        handler: function (request, h) {
            return h.view('users',
                {
                    title: 'Using handlebars in Hapi',
                    message: 'Tutorial'
                },
                {layout:'usersLayout'}
            )
        }
    }
];