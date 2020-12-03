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

            return h.response({courses: courses, price: computePrice(courses)}).code(201);
            // return h.view('card',
            //     {
            //         title: 'Card',
            //         courses: courses,
            //         isCard: true,
            //         price: computePrice(courses),
            //         isAuthenticated: request.auth.isAuthenticated,
            //
            //     },
            //     {layout:'Layout'}
            // )
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

            console.log('request.payload', request.payload);
            request.user = await User.findById(request.auth.credentials._id);
            //console.log('request.user', request.user);
            const course = await Course.findById(request.payload.id);

            await request.user.addToCart(course);
            return h.response({message: 'Товар добавлен в корзину!'}).code(200);
            //return h.redirect(`/${MODEL_NAME}`);
        }
    },
    {
        method: 'DELETE',
        path: `/${MODEL_NAME}/remove/{id}`,
        options: {
            auth: {
                mode: 'required',
                strategy: 'session60'
            }
        },
        handler: async function (request, h) {
            request.user = await User.findById(request.auth.credentials._id);
            await request.user.removeFromCart(request.params.id);
            const user = await request.user.populate('cart.items.courseId').execPopulate();
            const courses = mapCartItems(user.cart);
            const cart = {
                courses, price: computePrice(courses)
            };
            return h.response(cart).code(200);
        }
    }
]