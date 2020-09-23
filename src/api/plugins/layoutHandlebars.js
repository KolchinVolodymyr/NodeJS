'use strict';

const path = require('path');

exports.plugin = {
    name: 'layoutHandlebars',
    version: '1.0.0',
    register: function (server, options) {
        let reqPath = path.join(__dirname, '..');// Go back to one folder or directory from the given __dirname
        // console.log('reqPath',reqPath);
        // console.log('__dirname1',__dirname);

        //Handlebars
          server.views({
            engines: {
                hbs: require('handlebars')
            },

            relativeTo: reqPath,
            helpersPath: './templates', //the directory that contains your template helpers
            partialsPath: './templates/partials',
            path: reqPath + '/templates', //the directory that contains your main templates
            layoutPath: './templates/layout', //the directory that contains layout templates
        });

    }
};