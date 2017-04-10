require('dotenv').config();
const winston = require('winston');
var fullcontact = require('fullcontact').createClient(process.env.FC);

var personSearch = function(personObj, callback) {
    winston.info('[API STATUS] Person search started');

    fullcontact.person.email(personObj.email, function (err, data) {
        if(err) {
            winston.error(err);
            callback(err, null);
        } else {
            winston.info('[API STATUS] match ', data);
            callback(null, data)
        }
    });
};

module.exports = personSearch;