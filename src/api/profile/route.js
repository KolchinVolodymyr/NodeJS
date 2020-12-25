'use strict';

const MODEL_NAME = 'profile';
const User = require('./service');

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
                console.log(e);
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
                const email = request.payload.email
                const candidate = await User.findOne({email}); //looking for email in the database
                if (candidate) { //user with this email already exists
                    return h.response({message: 'Такой Email уже зарегистрирован. Введите другой Email.'}).code(400).takeover();
                } else {
                    await User.findByIdAndUpdate(request.auth.credentials._id, request.payload);
                    return h.response({message: 'Данные успешно изменены.'}).code(200).takeover();
                }
            } catch (e) {
                console.log(e);
            }
        }

    }
]



