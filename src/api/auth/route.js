'use strict';

const MODEL_NAME = 'login';

module.exports = [
    {
        method: 'GET',
        path: `/auth/${MODEL_NAME}`,
        handler:  function (request, h) {
            return h.view('auth/login',
                {
                    title: 'login',
                    message: 'Tutorial'
                },
                {layout:'Layout'}
            )
        }
    }
]