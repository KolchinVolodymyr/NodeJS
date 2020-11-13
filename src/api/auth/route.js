'use strict';

const MODEL_NAME = 'login';
const Joi = require('@hapi/joi');
const User = require('../users/service');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const {regEmail, resetEmail} = require('./service');
const Nodemailer = require('nodemailer');
const postmarkTransport = require('nodemailer-postmark-transport');

const transport = Nodemailer.createTransport(postmarkTransport({
    auth: {
        apiKey: 'b6eae292-0d5d-4330-bd2d-859f8bd1971c'
    }
}));

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
        handler: function (request, h) {

            return h.view('auth/login',
                {
                    title: 'login',
                    isLogin: true
                },
                {layout:'Layout'}
            )
        }
    },
    {
        method: 'POST',
        path: `/login`,
        handler: async (request, h) => {
            try {
                const {email, password} = request.payload;

                const candidate = await User.findOne({ email });

                if (candidate) {
                    const areSame = await bcrypt.compare(password, candidate.password)
                    if (areSame) {
                        request.cookieAuth.set(candidate);
                        return  h.redirect('/');

                    } else {
                        request.payload.message = 'Неверный пароль';
                        return h.view('auth/login', {
                            title: 'login',
                            error  : request.payload.message // error object used in html template
                        },{layout:'Layout'}).takeover();
                    }
                } else {
                    request.payload.message = 'Такой Email не зарегистирован.';
                    return h.view('auth/login', {
                        title: 'login',
                        error  : request.payload.message // error object used in html template
                    },{layout:'Layout'}).takeover();
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
                    email: Joi.string().email().required().error(new Error('Введите корректный email')),
                    password: Joi.string().min(3).max(8).required()
                }),
                options: {
                    allowUnknown: true,
                },
                failAction: (request, h, err) => {
                    return h.view('auth/login', {
                        title: 'login',
                        error  : err.output.payload.message // error object used in html template
                    },{layout:'Layout'}).takeover();
                }
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
                    request.payload.message = 'Такой Email уже зарегистрирован. Введите другой Email.';
                    return h.view('auth/login', {
                        title: 'login',
                        error  : request.payload.message, // error object used in html template
                    },{layout:'Layout'}).takeover();
                } else {
                    const hashPassword = await bcrypt.hash(password, 10)
                    const user = new User({
                        email, name, password: hashPassword, cart: {items: []}
                    })
                    await user.save();
                    await transport.sendMail(regEmail(email)); //sending mail
                    return h.redirect('/login#login');

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
                    email: Joi.string().email().required().error(new Error('Введите корректный email')),
                    password: Joi.string().min(3).max(8).required(),
                    confirm: Joi.string().valid(Joi.ref('password')).required().error(new Error('Пароль не совпадает, Повторите еще раз')),
                }),
                options: {
                    allowUnknown: true,
                },
                failAction: (request, h, err) => {
                    if (!request.payload.password) {
                        err.output.payload.message = 'Поле пароль пустое. Введите пароль';
                    }
                    if (request.payload.password.length > 1 && request.payload.password.length < 3) {
                        err.output.payload.message = 'Пароль состоит менее чем из 3 символов';
                    }
                    if (request.payload.password.length > 8) {
                        err.output.payload.message = 'Пароль состоит более чем из 8 символов';
                    }

                    return h.view('auth/login', {
                        title: 'login',
                        error  : err.output.payload.message // error object used in html template
                    },{layout:'Layout'}).takeover();

                }
            }
        }
    },
    {
        method: 'GET',
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
                return h.redirect('/login')
            } catch (e){
                console.log(e);
            }
        }
    },
    {
        method: 'GET',
        path: `/reset`,
        options: {
            auth: {
                mode: 'try',
                strategy: 'session60'
            }
        },
        handler: function (request, h) {
            return h.view('auth/reset',
                {
                    title: 'Reset'
                },
                {layout:'Layout'}
            )
        }
    },
    {
        method: 'POST',
        path: `/reset`,
        options: {
            auth: {
                mode: 'try',
                strategy: 'session60'
            },
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required().error(new Error('Введите корректный email'))
                }),
                options: {
                    allowUnknown: true,
                },
                failAction: (request, h, err) => {

                    return h.view('auth/reset', {
                        title: 'Reset',
                        error  : err.output.payload.message // error object used in html template
                    },{layout:'Layout'}).takeover();

                }
            }
        },
        handler: async function (request, h) {
            try {
                const token = crypto.randomBytes(32).toString('hex'); //генерация токена
                const candidate = await User.findOne({email: request.payload.email}); //looking for email in the database
                if (candidate) {
                    candidate.resetToken = token;
                    candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
                    await candidate.save();

                    await transport.sendMail(resetEmail(candidate.email, candidate.resetToken)); //sending mail
                    return h.redirect('/login');
                } else {
                    return h.view('auth/reset', {
                        title: 'Reset',
                        error  : 'Такой Email не зарегистирован.' // error object used in html template
                    },{layout:'Layout'}).takeover();
                }
                return h.redirect('/login');
            } catch (e) {
                console.log(e)
            }
        }
    },
    {
        method: 'GET',
        path: `/password/{token}`,
        options: {
            auth: {
                mode: 'try',
                strategy: 'session60'
            }
        },
        handler:async function (request, h) {
            if (!request.params.token) {
                return h.redirect('/login')
            }

            try {
                const user = await User.findOne({
                    resetToken: request.params.token,
                    resetTokenExp: {$gt: Date.now()}
                })

                if (!user) {
                    return h.view('auth/login', {
                        title: 'Login',
                        error  : 'Время жизни токена истекло',// error object used in html template
                    },{layout:'Layout'}).takeover();
                } else {
                    return h.view('auth/password',
                        {
                            title: 'NEW Password',
                            userId: user._id.toString(),
                            token: request.params.token
                        },
                        {layout:'Layout'}
                    )
                }
            } catch (e) {
                console.log(e)
            }

        }
    },
    {
        method: 'POST',
        path: `/password`,
        options: {
            auth: {
                mode: 'try',
                strategy: 'session60'
            }
        },
        handler: async function (request, h) {
            try {
                const user = await User.findOne({
                    _id: request.payload.userId,
                    resetToken: request.payload.token,
                    resetTokenExp: {$gt: Date.now()}
                })

                if (user) {
                    user.password = await bcrypt.hash(request.payload.password, 10);
                    user.resetToken = undefined;
                    user.resetTokenExp = undefined;
                    await user.save();
                    return h.redirect('/login');
                } else {
                    return h.redirect('/login');
                }

                return h.redirect('/login');
            } catch (e) {
                console.log(e)
            }
        }
    }
]