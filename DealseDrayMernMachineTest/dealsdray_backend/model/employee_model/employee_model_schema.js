const mongoose=require("mongoose");

const employeeSchema=new mongoose.Schema({
    employee_id:{type:String},
    employee_name:{type:String},
    email:{type:String},
    mobile:{type:String},
    designation:{type:String},
    gender:{type:String},
    course:{type:String},
    profileimg:{type:String},
    createdate:{type :String}
})

const employeeModel=mongoose.model("employeedata",employeeSchema);

module.exports=employeeModel;