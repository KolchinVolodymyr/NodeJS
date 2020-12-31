'use strict';

const Joi = require('@hapi/joi');
const User = require('../profile/schema');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');


module.exports = [
    {
        method: 'POST',
        path: `/login`,
        options: {
            auth: {
                mode: 'try',
                strategy: 'session60'
            },
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required().error(new Error('Please enter a valid email')),
                    password: Joi.string().min(3).max(8).required()
                }),
                options: {
                    allowUnknown: true,
                },
                failAction: (request, h, err) => {
                    if (!request.payload.email) {
                        return h.response({message: 'The email field is empty. Enter your email'}).code(400).takeover();
                    }
                    if (!request.payload.password) {
                        return h.response({message: 'The password field is empty. enter password'}).code(400).takeover();
                    }
                    return h.response({message: err.output.payload.message}).code(400).takeover();
                }
            }
        },
        handler: async (request, h) => {
            try {
                const {email, password} = request.payload;
                const candidate = await User.findOne({ email });
                if (candidate) {
                    const areSame = await bcrypt.compare(password, candidate.password);
                    if (areSame) {
                        await request.cookieAuth.set({_id: candidate._id});
                        const token = JWT.sign(
                            { userId: candidate.id },
                            'jwtSecret',
                            { expiresIn: '1h' }
                        );
                        return h.response({token: token, userId: candidate._id}).code(201);
                    } else {
                        return h.response({message: 'Invalid password'}).code(400).takeover();
                    }
                } else {
                    return h.response({message: 'This Email is not registered'}).code(400).takeover();
                }
            } catch (e) {
                console.log(e)
            }
        }

    },
    {
        method: 'POST',
        path: `/register`,
        handler: async function (request, h) {
            try {
                const {email, password, name} = request.payload;
                const candidate = await User.findOne({email}); //looking for email in the database

                if (candidate) { //user with this email already exists
                    return h.response({message: 'This Email is already registered. Enter another Email'}).code(400).takeover();
                } else {
                    const hashPassword = await bcrypt.hash(password, 10);
                    const user = new User({
                        email, name, password: hashPassword, cart: {items: []}
                    });
                    await user.save();

                    return h.response({message: 'Success! User created successfully'}).code(201);
                }
            } catch (e) {
                console.log(e)
            }
        },
        options: {
            auth: {
                mode: 'try',
                strategy: 'session60'
            },
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required().error(new Error('Please enter a valid email')),
                    password: Joi.string().min(3).max(8).required(),
                    confirm: Joi.string().valid(Joi.ref('password')).required().error(new Error('Password does not match, please try again')),
                    name: Joi.string().min(3).required(),
                }),
                options: {
                    allowUnknown: true,
                },
                failAction: (request, h, err) => {
                    if (!request.payload) {
                        return h.response({message: 'The email field is empty. Enter your email'}).code(400).takeover();
                    }
                    if (request.payload.password.length > 1 && request.payload.password.length < 3) {
                        err.output.payload.message = 'Password is less than 3 characters';
                        return h.response({message: err.output.payload.message}).code(400).takeover();
                    }
                    if (request.payload.password.length > 8) {
                        err.output.payload.message = 'Password has more than 8 characters';
                        return h.response({message: err.output.payload.message}).code(400).takeover();
                    }

                    if (!request.payload.name) {
                        return h.response({message: 'The name field is empty. Enter your name'}).code(400).takeover();
                    }
                    if (request.payload.name.length < 3) {
                        return h.response({message: 'Name field. Must be at least 3 characters'}).code(400).takeover();
                    }
                    return h.response({message: err.output.payload.message}).code(400).takeover();

                }
            }
        }
    },
    {
        method: 'POST',
        path: `/logout`,
        options: {
            auth: {
                mode: 'try',
                strategy: 'session60'
            }
        },
        handler: async function (request, h) {
            try {
                request.cookieAuth.clear();
                return h.response({message: 'Сookies deleted'}).code(200).takeover();
            } catch (e){
                console.log(e);
            }
        }
    }
]