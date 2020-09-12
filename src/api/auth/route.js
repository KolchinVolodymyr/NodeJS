'use strict';

const MODEL_NAME = 'login';
const User = require('../users/service');
const bcrypt = require('bcryptjs');


module.exports = [
    {
        method: 'GET',
        path: `/auth/login`,
        handler:  function (request, h) {
            return h.view('auth/login',
                {
                    title: 'login',
                    message: 'Tutorial',
                    isLogin: true
                },
                {layout:'Layout'}
            )
        },
        options: {
            auth: false
        }
    },
    {
        method: 'POST',
        path: `/auth/${MODEL_NAME}`,
        handler: async function (request, h) {
            try {
                const {email, password} = request.payload;
                const candidate = await User.findOne({ email });

                if (candidate) {
                    const areSame = await bcrypt.compare(password, candidate.password)
                    if (areSame) {

                        //request.cookieAuth.clear();
                        request.cookieAuth.set(candidate);
                        request.auth.isAuthenticated = true;
                        request.auth.isAuthorized = true;
                        //console.log('request.auth',request.auth);
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
        },
        options: {
            auth: {
                mode: 'required'
            }
        }
    },
    {
        method: 'POST',
        path: `/auth/register`,
        handler: async function (request, h) {
            try {
                const {email, password, repeat, name} = request.payload;
                const candidate = await User.findOne({email}); //looking for email in the database

                if (candidate) { //user with this email already exists
                    return h.redirect('/auth/login#register')
                } else {
                    const hashPassword = await bcrypt.hash(password, 10)
                    const user = new User({
                        email, name, password: hashPassword, cart: {items: []}
                    })
                    await user.save();

                    return h.redirect('/auth/login#login')
                }
            } catch (e) {
                console.log(e)
            }
        }
    },
    // {
    //     method: 'GET',
    //     path: `/logout`,
    //     handler: async function (request, h) {
    //         //request.cookieAuth.clear();
    //     }
    // }
]