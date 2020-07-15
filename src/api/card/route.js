'use strict';

const MODEL_NAME = 'card';
const Card = require('./service');
const Course = require('../add-course/service');

module.exports = [
    {
        method: 'GET',
        path: `/${MODEL_NAME}`,
        handler: async function (request, h) {
            const сard = await Card.fetch();
            return h.view('card',
                {
                    title: 'Card',
                    courses: сard.courses,
                    price: сard.price
                },
                {layout:'Layout'}
            )

        }
    },
    {
        method: 'POST',
        path: `/${MODEL_NAME}/add`,
        handler: async function (request, h) {
            const course = await Course.getById(request.payload.id);
            await Card.add(course);
            return h.redirect(`/${MODEL_NAME}`);
        }
    }


]