const Nodemailer = require('nodemailer');
const postmarkTransport = require('nodemailer-postmark-transport');


exports.plugin = {
    name: 'emailPostmark',
    version: '1.0.0',
        //
    register: async function (server, options) {
        const transport = Nodemailer.createTransport(postmarkTransport({
            auth: {
                apiKey: 'b6eae292-0d5d-4330-bd2d-859f8bd1971c'
            }
        }))

    }


};