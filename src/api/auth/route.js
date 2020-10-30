'use strict';

const MODEL_NAME = 'login';
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
                    //message: 'Tutorial',
                    isLogin: true
                },
                {layout:'Layout'}
            )
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
        handler: async (request, h) => {
            try {
                const email  = request.payload.email;
                const password = request.payload.password;

                const candidate = await User.findOne({ email });

                if (candidate) {
                    const areSame = await bcrypt.compare(password, candidate.password)
                    if (areSame) {
                        request.cookieAuth.set(candidate);
                        return  h.redirect('/');

                    } else {
                        //password
                        console.log('Неверный пароль');
                        return  h.redirect('/auth/login#login')
                    }
                } else {
                    //User does not exist
                    console.log('Такого пользователя не существует');
                    return h.redirect('/auth/login#login')
                }
            } catch (e) {
                console.log(e)
            }


        }
    },
    {
        method: 'POST',
        path: `/register`,
        options: {
            auth: {
                mode: 'try',
                strategy: 'session60'
            }
        },
        handler: async function (request, h) {
            try {
                const {email, password, repeat, name} = request.payload;
                const candidate = await User.findOne({email}); //looking for email in the database

                if (candidate) { //user with this email already exists
                    return h.redirect('/login#register')
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
            }
        },
        handler: function (request, h) {
            try {
                crypto.randomBytes(32, async (err, buffer) => {
                    if(err) {
                        console.log('error', err);
                        return h.redirect('/login');
                    }

                    const token = buffer.toString('hex');
                    const candidate = await User.findOne({email: request.payload.email}); //looking for email in the database
                    if (candidate) {
                        candidate.resetToken = token;
                        candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
                        await candidate.save();
                        //console.log('token', candidate.resetToken)
                        await transport.sendMail(resetEmail(candidate.email, candidate.resetToken)); //sending mail
                        return h.redirect('/login');
                    } else {
                        console.log('такой Email не зарегистирован');
                        //return h.redirect('/login');
                    }
                })
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
                    return h.redirect('/login')
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
                    console.log('Время жизни токена истекло');
                    return h.redirect('/login');
                }

                return h.redirect('/login');
            } catch (e) {
                console.log(e)
            }
        }
    }
]