require('dotenv').config();
const winston = require('winston');
var Person = require('../models/person').model;

var saveToMongo = function(personObj, callback){

    var person = new Person();

    person.email = personObj.email;
    person.fc_req_id = personObj.requestId;
    person.likelihood = personObj.likelihood;
    person.photos = personObj.photos;
    person.given_name = personObj.contactInfo.givenName;
    person.family_name = personObj.contactInfo.familyName;
    person.full_name = personObj.contactInfo.fullName;
    person.gender = personObj.demographics.gender;
    person.location = personObj.demographics.locationGeneral;
    person.social_profiles = personObj.socialProfiles;

    person.save(function(err) {
        if (err) {
            winston.error(err);
            callback(err, null);
        } else {
            winston.info('[API STATUS] Person mapped and saved to Mongo');
            callback(null, person)
        }
    });
};


module.exports = saveToMongo;


