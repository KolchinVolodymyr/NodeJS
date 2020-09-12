'use strict';

const MODEL_NAME = 'add-course';

const Course = require('./service');

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
        handler:  function (request, h) {
            return h.view('add',
                {
                    title: 'Courses add',
                    message: 'Tutorial',
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
        handler: async function (request, h) {
            const course = new Course({
                title: request.payload.title,
                price: request.payload.price,
                img: request.payload.img,
                userId: request.user
            });

            course.save();

            if (!course) {
                throw Boom.notFound(`No tutorial available for slug »${slug}«`)
            }
            return h.redirect(`/courses`);
        }
    }

]