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
        path: `/card`,
        options: {
            auth: {
                mode: 'try',
                strategy: 'session60'
            }
        },
        handler: async function (request, h) {
            request.user = await User.findById('5f5816b351c8d243ac929125');
            const user = await request.user
                .populate('cart.items.courseId')
                .execPopulate();

            const courses = mapCartItems(user.cart)
            return h.view('card',
                {
                    title: 'Card',
                    courses: courses,
                    isCard: true,
                    price: computePrice(courses),
                    isAuthenticated: request.auth.isAuthenticated
                },
                {layout:'Layout'},
                //console.log('request.auth',request.auth)
            )

        }
    },
    {
        method: 'POST',
        path: `/${MODEL_NAME}/add`,
        handler: async function (request, h) {
            const course = await Course.findById(request.payload.id);
            //await User.findById(request.session.user._id);
            //console.log('User',User);
            //console.log('POST request.auth',request.auth);
            await request.user.addToCart(course);
            return h.redirect(`/${MODEL_NAME}`);
        }
    },
    {
        method: 'DELETE',
        path: `/${MODEL_NAME}/remove/{id}`,
        handler: async function (request, h) {
            await request.user.removeFromCart(request.params.id)
            
            const user = await request.user.populate('cart.items.courseId').execPopulate()
            const courses = mapCartItems(user.cart)
            const cart = {
                courses, price: computePrice(courses)
            }
            return h.response(cart).code(200);

        }
    }


]