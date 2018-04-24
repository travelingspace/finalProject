var mongoose = require("mongoose");

var quoteSchema = mongoose.Schema({
    name: String,
    quoteDate: {
        type: Date, default: Date.now()
    },
    description: String,
    userID: String,
    status: {
        Boolean, default: 1
    }
});

Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;