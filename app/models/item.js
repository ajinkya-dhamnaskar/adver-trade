var mongoose = require('mongoose');

var itemSchema = mongoose.Schema({
    local         : {
	name	 : String,
	price	 : String,
    category     : String,
    email        : String,
    phone		 : String,
    password     : String,
    }
});


itemSchema.methods.update = function(request, response){
	this.user.name = request.body.name;
	this.user.save();
	response.redirect('./app/models/user');
};

module.exports = mongoose.model('Item', itemSchema);
