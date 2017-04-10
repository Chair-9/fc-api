require('dotenv').config();
const winston = require('winston');
const mongoose = require('mongoose');
var Person = require('../models/person').model;

var cacheCheck = function(email, callback){

    var start = new Date(new Date().getTime() - (30 *24 * 60 * 60 * 1000));//30 days

    Person.findOne({'email': email}).where('created_at').gte(start).exec(function(err, person){

    });


};

module.exports = cacheCheck;