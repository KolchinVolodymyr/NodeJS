'use strict';

const MODEL_NAME = 'courses';
const Joi = require('@hapi/joi');
const Course = require('../add-course/service');

module.exports = [

    {
        method: 'GET',
        path: `/${MODEL_NAME}/{id}/edit`,
        options: {
            auth: {
                mode: 'required',
                strategy: 'session60'
            }
        },
        handler: async function (request, h) {
            const course = await Course.findById(request.params.id);
            return h.view('course-edit',
                {
                    title: 'Edit course',
                    isAuthenticated: request.auth.isAuthenticated,
                    course
                },
                {layout:'Layout'}
            )
        }
    },
    {
        method: 'POST',
        path: `/${MODEL_NAME}/edit`,
        options: {
            auth: {
                mode: 'required',
                strategy: 'session60'
            },
            validate: {
                payload: Joi.object({
                    title: Joi.string().min(3).required().error(new Error('Минимальная длинна названия 3 символа')),
                    price: Joi.number().integer().required().error(new Error('Введите корректную цену')),
                    img: Joi.string().uri().required().error(new Error('Введите корректный Url картинки')),
                }),
                options: {
                    allowUnknown: true,
                },
                failAction: async (request, h, err) => {
                    const id = request.payload.id;
                    console.log(err.output.payload.message);
                    return h.redirect(`/${MODEL_NAME}/${id}/edit`, { error: 'value' }).takeover();
                }
            },
        },
        handler: async function (request, h) {
            try {
                await Course.findByIdAndUpdate(request.payload.id, request.payload);
                return h.redirect(`/${MODEL_NAME}`);
            } catch (e){
                console.log(e);
            }
        }
    },
    {
        method: 'POST',
        path: `/${MODEL_NAME}/remove`,
        options: {
            auth: {
                mode: 'required',
                strategy: 'session60'
            }
        },
        handler: async function (request, h) {
            try {
                await Course.deleteOne({_id: request.payload.id});
                return h.redirect(`/${MODEL_NAME}`);
            } catch (e){
                console.log(e);
            }
        }
    }
]