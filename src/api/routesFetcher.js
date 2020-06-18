"use strict";

const find = require('find'),
    {flatten} = require('lodash');

function getTogetherAllRoutes() {
    const routesArray = [];
    console.log(routesArray);
    find.fileSync(/route.js/, __dirname).forEach(route => routesArray.push(require(route)));
    return flatten(routesArray);
}

module.exports = getTogetherAllRoutes();