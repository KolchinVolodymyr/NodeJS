'use strict';

const MODEL_NAME = 'login';
const User = require('../users/service');
const bcrypt = require('bcryptjs');


module.exports = [
    {
        method: 'GET',
        path: `/auth/${MODEL_NAME}`,
        handler:  function (request, h) {
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
        path: `/auth/${MODEL_NAME}`,
        handler: async function (request, h) {
            try {
                const {email, password} = request.payload;
                const candidate = await User.findOne({ email });

                if (candidate) {
                    const areSame = await bcrypt.compare(password, candidate.password)
                    console.log('candidate',candidate);
                    console.log('areSame',areSame);
                    console.log('request.state',request.state);
                    if (areSame) {
                        request.state.user = candidate
                        request.state.isAuthenticated = true
                        request.state.save(err => {
                             if (err) {
                                 throw err
                             }
                            return h.redirect('/');
                            console.log('request.session.isAuthenticated',request.session.isAuthenticated);
                            console.log('request.state',request.state);
                         })
                    } else {
                            return  h.redirect('/auth/login#login')
                    }
                } else {
                        return h.redirect('/auth/login#login')
                }
            } catch (e) {
                console.log(e)
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
    }
]