const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username :{
        type:String,
        unique:true,
        max:20,
        required:true
    },
    email :{
        type:String,
        unique:true,
        max:50,
        required:true
    },
    password :{
        type:String,
        max:20,
        required:true
    },
    addedContacts:Array,
    profilePic :{
        type:String
    }
})

module.exports= mongoose.model("users",userSchema)