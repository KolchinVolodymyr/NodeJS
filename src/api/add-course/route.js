'use strict';

const MODEL_NAME = 'add-course';

const Course = require('./service');
const User = require('../users/service')

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
        handler: async function (request, h) {
            //Временное решение
            const user = await User.findById('5f273f0833365d3314b8c1dd');
            request.user = user;

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
            return course;
        }
    }

]