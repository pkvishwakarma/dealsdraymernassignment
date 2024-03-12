require("dotenv").config();
const express=require("express");
const app=express();
const cors=require("cors");
const PORT=process.env.PORT || 4000;
const connectDB=require("./connectDB/connectDB");
const adminRoutes=require("./routes/adminData_Routes/admin_route");
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));

app.use("/admin",adminRoutes);

const start=async()=>{
    try{
        await connectDB(process.env.MONGODB_URL);
        app.listen(PORT,()=>{
            console.log("Server is Running on PORT no "+PORT);
        })
    }
    catch(error){
        console.log(error)
    }
}

start();