const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose =require("passport-local-mongoose");

///by default it will add a username and password  field and hash and salt field to store the user name 

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    },

});


userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema);