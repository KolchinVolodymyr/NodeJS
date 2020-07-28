'use strict';

const MODEL_NAME = 'add-course';

const Course = require('./service');

module.exports = [
    {
        method: 'GET',
        path: `/${MODEL_NAME}`,
        handler:  function (request, h) {
            return h.view('add',
                {
                    title: 'Courses add',
                    message: 'Tutorial'
                },
                {layout:'Layout'}
            )
        }
    },
    {
        method: 'POST',
        path: `/${MODEL_NAME}`,
        handler: function (request, h) {

            // const course = new Course(request.payload.title, request.payload.price, request.payload.img)
            const course = new Course({
                title: request.payload.title,
                price: request.payload.price,
                img: request.payload.img
            });
            course.save();

            if (!course) {
                throw Boom.notFound(`No tutorial available for slug »${slug}«`)
            }
            return course;
        }
    }

]