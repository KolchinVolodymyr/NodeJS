const mongoose = require('mongoose');

exports.plugin = {
    name: 'connectMongoose',
    version: '1.0.0',
    register: async function (server, options) {
        //
        //connect BD
        const url =`mongodb+srv://admin:380990302581@cluster0.eufzr.mongodb.net/shop`
        await mongoose.connect(url,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });

    }
};