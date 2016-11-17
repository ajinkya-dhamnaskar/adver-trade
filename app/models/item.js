var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var itemSchema = mongoose.Schema({
	item : {
		title : String,
		price : String,
		category : String,
		description : String,
		username : [ {
			type : String,
			ref : 'User'
		} ],
		catId : [ {
			type : Number,
			ref : 'Category'
		} ]
	}
});

itemSchema.methods.updateitem = function(request, response) {
	this.item.title = request.body.title;
	this.item.price = request.body.price;
	this.item.category = request.body.category;
	this.item.username = request.user.local.email;
	this.item.description = request.body.description;

	this.item.save(function(err) {
		if (err) {
			throw err;
		}

	});
};

/* deletes the product passed in as arguement from the products collection */
itemSchema.methods.deleteitem = function(request, response) {
	item.remove(function(err) {
		if (err) {
			throw err;
		}

	});
}

module.exports = mongoose.model('Item', itemSchema);
// Item.find().populate("username");
