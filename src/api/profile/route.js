'use strict';

const MODEL_NAME = 'profile';
const User = require('../users/service');
const fs = require('fs');
const path = require('path');

module.exports = [
    {
        method: 'GET',
        path: `/${MODEL_NAME}`,
        options: {
            auth: {
                mode: 'try',
                strategy: 'session60'
            }
        },
        handler: function (request, h) {
            try {
                return h.response(request.auth.credentials).code(200).takeover();
            } catch (e) {
                console.log('Error', e);
            }
        }
    },
    {
        method: 'POST',
        path: `/${MODEL_NAME}`,
        options: {
            auth: {
                mode: 'try',
                strategy: 'session60'
            },
        },
            handler: async (request, h) => {
                try {
                    await User.findByIdAndUpdate(request.auth.credentials._id, request.payload);

                    return h.response({message: 'Данные успешно изменены.'}).code(200).takeover();
                } catch (e) {
                    console.log(e);
                }
            }

    }
]



