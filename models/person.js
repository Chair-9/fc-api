var mongoose = require('mongoose');


var PersonSchema = new mongoose.Schema({
    email : { type: String, required: true, index : true },
    fc_req_id : String,
    created_at : { type: Date, required: true, default: Date.now, index : true }
});

module.exports = {
    model : mongoose.model('Person', PersonSchema)
};