var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    local         : {
	firstname	 : String,
	lastname	 : String,
    username     : String,
    email        : String,
    phone		 : String,
    password     : String,
    }
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.updateUser = function(request, response){
	this.user.name = request.body.name;
	this.user.save();
	response.redirect('./app/models/user');
};

module.exports = mongoose.model('User', userSchema);
