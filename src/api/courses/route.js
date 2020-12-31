'use strict';

const MODEL_NAME = 'courses';
const Course = require('../add-course/schema');

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
        handler: async function (request, h) {
            const courses = await Course.find();
            return h.response(courses).code(200).takeover();
        }
    },
    {
        method: 'GET',
        path: `/${MODEL_NAME}/{id}`,
        options: {
            auth: {
                mode: 'try',
                strategy: 'session60'
            }
        },
        handler: async function (request, h) {
            try {
                const course = await Course.findById(request.params.id);
                return h.response(course).code(200).takeover();
            } catch (e) {
                console.log(e);
            }
        }
    }
]