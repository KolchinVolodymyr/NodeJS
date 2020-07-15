'use strict';

const MODEL_NAME = 'courses';

const Course = require('../add-course/service');

module.exports = [
    {
        method: 'GET',
        path: `/${MODEL_NAME}`,
        handler: async function (request, h) {
            const courses = await Course.getAll();
            return h.view('courses',
                {
                    title: 'Courses',
                    message: 'Tutorial',
                    courses
                },
                {layout:'Layout'}
            )
        }
    },
    {
        method: 'GET',
        path: `/${MODEL_NAME}/{id}`,
        handler: async function (request, h) {
            const course = await Course.getById(request.params.id);
            return h.view('course',
                {
                    title: `Courses ${course.title}` ,
                    message: 'Tutorial',
                    course
                },
                {layout:'Layout'}
            )
        }
    }

]