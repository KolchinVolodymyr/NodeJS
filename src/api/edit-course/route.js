'use strict';

const MODEL_NAME = 'courses';

const Course = require('../add-course/service');

module.exports = [

    {
        method: 'GET',
        path: `/${MODEL_NAME}/{id}/edit`,
        handler: async function (request, h) {
            const course = await Course.getById(request.params.id);
            return h.view('course-edit',
                {

                    message: 'Tutorial',
                    course
                },
                {layout:'Layout'}
            )
        }
    },
    {
        method: 'POST',
        path: `/${MODEL_NAME}/edit`,
        handler: async function (request, h) {
            await Course.update(request.payload);
            return h.redirect(`/${MODEL_NAME}`);

        }
    }

]