'use strict';

const MODEL_NAME = 'orders';
const Order = require('./service');
const User = require('../users/service');


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
            try {
                const orders = await Order.find({'user.userId': request.auth.credentials._id})
                    .populate('user.userId')
                return h.view('orders',
                    {
                        title: 'Orders',
                        isOrder: true,
                        orders: orders.map(o => {
                            return {
                                ...o._doc,
                                price: o.courses.reduce((total, c)=>{
                                    return total += c.count * c.course.price
                                },0)
                            }
                        }),
                        isAuthenticated: request.auth.isAuthenticated
                    },
                    {layout:'Layout'}
                )
            }catch (e) {
                console.log(e);
            }
        }
    },
    {
        method: 'POST',
        path: `/${MODEL_NAME}`,
        options: {
            auth: {
                mode: 'try',
                strategy: 'session60'
            }
        },
        handler: async function (request, h) {
             try{
                request.user = await User.findById(request.auth.credentials._id);
                const user = await request.user.populate('cart.items.courseId').execPopulate();

                const courses = user.cart.items.map(i=>({
                    count: i.count,
                    course: {...i.courseId._doc}
                }))

                const order = new Order({
                    user: {
                        name: request.user.name,
                        userId: request.user
                    },
                    courses: courses
                })
                await order.save();
                await request.user.clearCart();
                return h.redirect(`/orders`);
             }
             catch (e) {
                 console.log(e);
             }
        }
    }

    ]