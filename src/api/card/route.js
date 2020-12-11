'use strict';

const MODEL_NAME = 'card';
const User = require('../users/service');
const Course = require('../add-course/service');


function mapCartItems(cart) {
    return cart.items.map(c => ({
        ...c.courseId._doc,
        id: c.courseId.id,
        count: c.count
    }))
}

function computePrice(courses) {
    return courses.reduce((total, course) => {
        return total += course.price * course.count
    }, 0)
}

module.exports = [
    {
        method: 'GET',
        path: `/${MODEL_NAME}`,
        options: {
            auth: {
                mode: 'required',
                strategy: 'session60'
            }
        },
        handler: async function (request, h) {
            request.user = await User.findById(request.auth.credentials._id);
            const user = await request.user
                .populate('cart.items.courseId')
                .execPopulate();
            const courses = mapCartItems(user.cart);

            return h.response({
                courses: courses,
                price: computePrice(courses)
            }).code(200).takeover();

        }
    },
    {
        method: 'POST',
        path: `/${MODEL_NAME}/add`,
        options: {
            auth: {
                mode: 'required',
                strategy: 'session60'
            }
        },
        handler: async function (request, h) {
            if (!request.payload.userId) {
                return h.response({message: 'Необходимо авторизоваться'}).code(401);
            }
            request.user = await User.findById(request.payload.userId);
            const course = await Course.findById(request.payload.id);

            await request.user.addToCart(course);
            return h.response({message: 'Товар добавлен в корзину!'}).code(200);

        }
    },
    {
        method: 'DELETE',
        path: `/${MODEL_NAME}/remove`,
        options: {
            auth: {
                mode: 'required',
                strategy: 'session60'
            }
        },
        handler: async function (request, h) {
            request.user = await User.findById(request.auth.credentials._id);
            await request.user.removeFromCart(request.payload.id);
            const user = await request.user.populate('cart.items.courseId').execPopulate();
            const courses = mapCartItems(user.cart);
            const cart = {
                courses, price: computePrice(courses)
            };
            return h.response(cart).code(200);
        }
    }
]