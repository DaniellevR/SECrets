var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    secret: { type: String, required: true }
},
{
	toObject: { virtuals: true },
	toJSON: { virtuals: true }
});

module.exports = mongoose.model('User', userSchema);