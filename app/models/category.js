var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');


var categorySchema = mongoose.Schema({
    category : {
        ID                : Number,
        name              : String,
        image			  : String
    }
});


//
//categorySchema.methods.getCategories = function (callback){
//	configDB.collection('catgeory').find({}, function(err, categories){
//    if(err){
//        console.log(err);
//        res.json(err);
//    }
//    else{
//    	if (categories.length == 1)
//        {
//            returnable_name = categories[0].name;
//            console.log(returnable_name); // this prints "Renato", as it should
//            callback(returnable_name);
//        }
//     //   res.json(products);
//    }
//	});
//}

module.exports = mongoose.model('Category', categorySchema);
