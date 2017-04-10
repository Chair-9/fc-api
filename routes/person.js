require('dotenv').config();
const winston = require('winston');
const async = require('async');
var express = require('express');
var router = express.Router();
var cacheCheck = require('../lib/cacheCheck');


router.post('/', function(req, res, next) {
    var personObj = {};
    var returnObj = {};
    var email = req.body.email;

    winston.info('[API STATUS] a POST to /person has been received for ', req.email);

    async.series([
        function(cacheCallback) {
            cacheCheck(email, function(err, data){
                if(err){
                    winston.error(err);
                    cacheCallback();
                } else {
                    winston.info('[API STATUS] Cache check workflow complete');
                    personObj = data;
                    cacheCallback();
                }
            });
        },
        function(fcCallback) {

            fcCallback()

        },
        function(mongoCallback) {

            mongoCallback()

        },
        function(returnFormatCallback) {

            returnFormatCallback()

        }
    ], function (err) {

        if(err) {
            winston.error(err);
            res.status(500).send(err)
        } else {
            winston.info('[API STATUS] /person workflow complete.  Sending response');
            res.status(500).send(returnObj)
        }


    });





});

module.exports = router;