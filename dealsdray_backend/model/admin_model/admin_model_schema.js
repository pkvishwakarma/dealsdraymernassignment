const mongoose=require("mongoose");

const adminSchema=new mongoose.Schema({
    admin_id:{type:String},
    admin_name:{type:String},
    password:{type:String}
})

const adminModel=mongoose.model("admindata",adminSchema);

module.exports=adminModel;