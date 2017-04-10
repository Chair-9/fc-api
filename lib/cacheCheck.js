require('dotenv').config();
const winston = require('winston');
const mongoose = require('mongoose');
var Person = require('../models/person').model;

var cacheCheck = function(email, callback){
    var stubbyPerson = {email: email};
    var start = new Date(new Date().getTime() - (30 *24 * 60 * 60 * 1000));//30 days

    Person.findOne({'email': email}).where('created_at').gte(start).exec(function(err, person){
        if(err){
            winston.error(err);
            callback(err, null);
        } else {
            if(!person) {
                winston.info('[API STATUS] cache miss for ', email);
                stubbyPerson.cacheHit = false;
                callback(null, stubbyPerson);
            } else {
                winston.info('[API STATUS] cache hit for ', email);
                person.cacheHit = true;
                callback(null, person);
            }
        }
    });
};

module.exports = cacheCheck;