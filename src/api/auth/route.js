'use strict';

const MODEL_NAME = 'login';
const User = require('../users/service');
const bcrypt = require('bcryptjs');
const regEmail = require('./service')
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
                    message: 'Tutorial',
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
    }
]