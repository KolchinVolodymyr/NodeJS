'use strict';

const MODEL_NAME = 'courses';

const Course = require('./service');

module.exports = [
    {
        method: 'GET',
        path: `/${MODEL_NAME}`,
        handler: async function (request, h) {
            const courses = await Course.getAll();
            return h.view('courses',
                {
                    title: 'Courses add',
                    message: 'Tutorial',
                    courses
                },
                {layout:'Layout'}
            )
        }
    },
    {
        method: 'POST',
        path: `/${MODEL_NAME}`,
        handler: function (request, h) {

            const course = new Course(request.payload.title, request.payload.price, request.payload.img)
            course.save();

            if (!course) {
                throw Boom.notFound(`No tutorial available for slug »${slug}«`)
            }
            return course;
        }
    }
    // {
    //     method: 'POST',
    //     path: `/${MODEL_NAME}`,
    //     console.log(require.body)
    // }

]