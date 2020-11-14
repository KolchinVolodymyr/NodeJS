'use strict';

const MODEL_NAME = 'profile';
const User = require('../users/service');
const fs = require('fs');
const path = require('path');

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

            return h.view('profile',
                {
                    title: 'Profile',
                    isProfile: true,
                    user: request.auth.credentials,
                   //  user: {
                   //      name: request.auth.credentials.name,
                   //      email: request.auth.credentials.email,
                   //      avatarUrl: request.auth.credentials.avatarUrl
                   //  },
                    isAuthenticated: request.auth.isAuthenticated
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
            },
            payload: {
                maxBytes: 209715200,
                output: 'stream',
                parse: true
            }
        },
            handler: async (request, h) => {
                try {
                    const handleFileUpload = avatar => {
                        return new Promise((resolve, reject) => {
                            const filename = request.payload.avatar.hapi.filename;

                            const data = avatar._data;
                            fs.writeFile('./public/upload/' + filename, data, err => {
                                if (err) {
                                    reject(err)
                                }
                                resolve({ message: 'Upload successfully!' })
                            })
                        })
                    }

                    const { payload } = request;
                    const response = handleFileUpload(payload.avatar);

                    request.user = await User.findById(request.auth.credentials._id);
                    request.user.name = request.payload.name;
                    request.user.avatarUrl = '/public/upload/' + request.payload.avatar.hapi.filename;

                    await request.user.save()
                    return h.redirect(`/${MODEL_NAME}`);
                } catch (e) {
                    console.log(e);
                }
            }

    }
]



