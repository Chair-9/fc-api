require('dotenv').config();
const winston = require('winston');
var fullcontact = require('fullcontact').createClient(process.env.FC);

var personSearch = function(email, callback) {
    winston.info('[API STATUS] Person search started');

    fullcontact.person.email(email, function (err, data) {
        if(err) {
            winston.error(err);
            callback(err, null);
        } else {
            winston.info('[API STATUS] ', data);

        }

    });




};

module.exports = personSearch;