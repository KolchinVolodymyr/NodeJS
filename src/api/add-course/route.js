'use strict';

const MODEL_NAME = 'add-course';
const Joi = require('@hapi/joi');
const Course = require('./service');
const Boom = require('@hapi/boom');


module.exports = [
    {
        method: 'GET',
        path: `/${MODEL_NAME}`,
        options: {
            // auth: {
            //     mode: 'required',
            //     strategy: 'session60'
            // }
        },
        handler:  function (request, h) {

            return h.view('add',
                {
                    title: 'Courses add',
                    isAdd: true,
                    isAuthenticated: request.auth.isAuthenticated
                },
                {layout:'Layout'}
            )
        }
    },
    {
        method: 'POST',
        path: `/${MODEL_NAME}`,
        options: {
            // auth: {
            //     mode: 'required',
            //     strategy: 'session60'
            // },
            validate: {
                payload: Joi.object({
                    title: Joi.string().min(3).required().error(new Error('Минимальная длинна названия 3 символа')),
                    price: Joi.number().integer().required().error(new Error('Введите корректную цену')),
                    img: Joi.string().uri().required().error(new Error('Введите корректный Url картинки')),
                }),
                options: {
                    allowUnknown: true,
                },
                failAction: (request, h, err) => {
                    return h.view('add', {
                        title: 'Courses add',
                        error  : err.output.payload.message, // error object used in html template
                        data: {
                            title: request.payload.title,
                            price: request.payload.price,
                            img: request.payload.img
                        }
                    },{layout:'Layout'}).takeover();
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
                throw Boom.notFound(`No tutorial available for slug »${slug}«`)
            }
            return h.redirect(`/courses`);
        }
    }

]