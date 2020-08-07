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
        handler: function (request, h) {
            request.auth.isAuthenticated = true;
            //console.log(request.auth);
            return h.redirect(`/`);
        }
    }
]