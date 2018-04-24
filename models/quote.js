var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var quoteSchema = new Schema({
    name: String,
    quoteDate: {
        type: Date, default: Date.now()
    },
    description: String,
    userID: String,
    status: {
        type: Boolean, default: 1
    }
});

var Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;