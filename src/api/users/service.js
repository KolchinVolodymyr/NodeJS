"use strict";

const _ = require('lodash'),
    boom = require('boom');

const usersArray = [];

module.exports = {

    getAll: () => Promise.resolve(usersArray),

    getById: async (id) => {
        if (!id) { throw boom.badData('Wrong id')}

        return Promise.resolve(_.first(_.filter(usersArray, user => user.id === id)));
    },

    /**
     * creates new entry
     * @param {Object} data - required
     * @param {String} data.id - required
     * @param {String} data.name - required
     *
     * @returns {Object | Error} - response
     */
    create: (data) => {
        if (_.isEmpty(data)) throw boom.badData("It must be an object");
        usersArray.push(data);

        return Promise.resolve(data);
    }
};