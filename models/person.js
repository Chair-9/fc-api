var mongoose = require('mongoose');


var PersonSchema = new mongoose.Schema({
    email : { type: String, required: true, index : true },
    created_at : { type: Date, required: true, default: Date.now, index : true },
    fc_req_id : String,
    likelihood : Number,
    photos : Array,
    given_name : String,
    family_name : String,
    full_name : String,
    gender : String,
    location : String,
    social_profiles : Array,

});

module.exports = {
    model : mongoose.model('Person', PersonSchema)
};