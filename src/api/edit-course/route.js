'use strict';

const MODEL_NAME = 'courses';

const Course = require('../add-course/service');

module.exports = [

    {
        method: 'GET',
        path: `/${MODEL_NAME}/{id}/edit`,
        handler: async function (request, h) {
            const course = await Course.findById(request.params.id);
            return h.view('course-edit',
                {
                    title: 'Edit course',
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
            await Course.findByIdAndUpdate(request.payload.id, request.payload);
            return h.redirect(`/${MODEL_NAME}`);

        }
    },
    {
        method: 'POST',
        path: `/${MODEL_NAME}/remove`,
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