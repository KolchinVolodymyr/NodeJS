'use strict';

const find = require('find'),
    {flatten} = require('lodash');
const path = require('path');

function getTogetherAllRoutes() {
    const routesArray = [];
    let reqPath = path.join(__dirname, '../');// Go back to one folder or directory from the given __dirname

    find.fileSync(/route.js/, reqPath).forEach(route => routesArray.push(require(route)));
    return flatten(routesArray);
}

exports.plugin = {
    name: 'routesFetcher',
    version: '1.0.0',
    register: async function (server, options) {
        // load all routes:
        await server.route(getTogetherAllRoutes());

    }
};