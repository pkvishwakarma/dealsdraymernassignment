const mongoose=require("mongoose");
const connectDB=(uri)=>{
    return(
        mongoose.connect(uri).then(()=>{
            console.log("Connect with DB");
        })
        .catch((error)=>{
            console.log(error);
        })
    )
}

module.exports=connectDB;
