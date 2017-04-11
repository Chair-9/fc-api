require('dotenv').config();
const winston = require('winston');
const async = require('async');
var express = require('express');
var router = express.Router();
var cacheCheck = require('../lib/cacheCheck');
var personSearch = require('../lib/personSearch');
var saveToMongo = require('../lib/saveToMongo');


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

            if(personObj && personObj.cacheHit && personObj.cacheHit == true){
                winston.info('[API STATUS] Cache hit detected, skipping FC Call');
                fcCallback();
            } else {
                personSearch(personObj, function(err, data){
                    if(err){
                        winston.error(err);
                        fcCallback();
                    } else {
                        winston.info('[API STATUS] Search workflow complete');
                        personObj = data;
                        personObj.email = email;
                        fcCallback();
                    }
                });
            }
        },
        function(mongoCallback) {

            if(personObj && personObj.cacheHit && personObj.cacheHit == true){
                winston.info('[API STATUS] Cache hit detected, skipping Mongo write Call');
                mongoCallback();
            } else {
                saveToMongo(personObj, function(err, data){
                    if(err){
                        winston.error(err);
                        mongoCallback();
                    } else {
                        winston.info('[API STATUS] Mongo write workflow complete');
                        mongoCallback();
                    }
                });
            }
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
            res.status(200).send(returnObj)
        }
    });
});

module.exports = router;