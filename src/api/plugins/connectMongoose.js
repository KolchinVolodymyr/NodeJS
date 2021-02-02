const mongoose = require('mongoose');
const config = require('config');

exports.plugin = {
    name: 'connectMongoose',
    version: '1.0.0',
    register: async function (server, options) {
        //
        //connect BD
        const url = config.get('mongoUrl');
        await mongoose.connect(url,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });

    }
};