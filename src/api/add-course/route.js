'use strict';

const MODEL_NAME = 'add-course';
const Joi = require('@hapi/joi');
const Course = require('./schema');


module.exports = [
    {
        method: 'POST',
        path: `/${MODEL_NAME}`,
        options: {
            auth: {
                mode: 'try',
                strategy: 'session60'
            },
            validate: {
                payload: Joi.object({
                    title: Joi.string().min(3).required().error(new Error('Minimum name length 3 characters')),
                    price: Joi.number().integer().required().error(new Error('Enter the correct price')),
                    img: Joi.string().uri().required().error(new Error('Enter the correct url of the picture')),
                }),
                options: {
                    allowUnknown: true,
                },
                failAction: (request, h, err) => {
                    return h.response({message: err.output.payload.message}).code(400).takeover();
                }
            },
        },
        handler: async function (request, h) {
            const course = new Course({
                title: request.payload.title,
                price: request.payload.price,
                img: request.payload.img,
                userId: request.auth.credentials._id,
            });

            course.save();
            if (!course) {
                return h.response({message: 'An error occured, please try again later!'})
            }
            return h.response({message: 'Course successfully created !!!'}).code(201).takeover();
        }
    }

]