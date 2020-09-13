'use strict';

const MODEL_NAME = 'courses';

const Course = require('../add-course/service');

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

            return h.view('courses',
                {
                    title: 'Courses',
                    message: 'Tutorial',
                    isCourses: true,
                    isAuthenticated: request.auth.isAuthenticated,
                    courses
                },
                {layout:'Layout'},
            )

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
            const course = await Course.findById(request.params.id);
            return h.view('course',
                {
                    title: `Courses ${course.title}` ,
                    message: 'Tutorial',
                    isAuthenticated: request.auth.isAuthenticated,
                    course
                },
                {layout:'Layout'}
            )
        }
    }

]