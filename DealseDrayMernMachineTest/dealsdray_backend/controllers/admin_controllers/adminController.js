const express = require("express");
const adminModel = require("../../model/admin_model/admin_model_schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//1st API:Fetching all Admin Profile Data from Database using GET Method on API Path:http://127.0.0.1:4000/admin/data 
const fetchAdminProfileData = (req, res) => {
    try {
        adminModel.find({}).then((data) => {
            res.send(data);
        })
    }
    catch (error) {
        console.log(error.massage);
    }
};

//2nd API:Register Admin Profile Data into Database using POST Method on API Path:http://127.0.0.1:4000/admin/registeradmin 
const registerAdminProfile = async (req, res) => {
    const { admin_name, password } = req.body;
    try {
        if (!(admin_name && password)) {
            res.send("All Inputs Required");
            return;
        };
        var oldAdmin = await adminModel.findOne({ admin_name });
        if (oldAdmin) {
            return res.status(400).json({ message: "Admin Profile Already Exist" });
        }
        var hashpassword = await bcrypt.hash(password, 10);
        var adminCount=1;
        var adminOldId=await adminModel.findOne({admin_id:`admin${adminCount}`});

        //Verifying AdminId with database and Generating New AdminId for New Admin during Registration..
        while(adminOldId){
            adminCount=adminCount+1;
            adminOldId=await adminModel.findOne({admin_id:`admin${adminCount}`});
        }

        await adminModel.create({ admin_id:`admin${adminCount}`, admin_name, password: hashpassword}).then((adminData) => {
            console.log(adminData)
        });

        var data = ({
            admin: {
                admin_name: admin_name
            }
        });
        var token = jwt.sign(data, process.env.JWT_SECRET_KEY);
        res.status(200).json({
            token: token,
            message: 'Admin registered Successfully',
            status: 200
        });
    }
    catch (error) {
        console.log(error);
    }
};

//3th API:Verify Adminname from Database using POST Method on API Path:http://127.0.0.1:4000/admin/verifyregister 
const verifyRegisterAdmin = async (req, res) => {
    var { admin_name } = req.body;
    try {
        var matchname = await adminModel.findOne({admin_name });
        if (matchname) {
            if (matchname.admin_name === admin_name) {
                var uniqeAdminname = admin_name += Math.floor((Math.random() * 1000) + 1);
                var randomAdminVerify = adminModel.find({ admin_name: uniqeAdminname });
                if (!randomAdminVerify.length > 0) {
                    return res.status(200).send(uniqeAdminname);
                }
                else {
                    verifyRegisterAdmin(req, res);
                }
            }
        }
        else {
            res.status(200).send("Admin Name Available");
            return;
        }
    }
    catch (error) {
        console.log(error);
    }
}

//4th API:Verify AdminLogin from Database using POST Method on API Path:http://127.0.0.1:4000/admin/verifyadminlogin 
const verifyAdminLogin = async (req, res) => {
    const { admin_name, password } = req.body;
    try {
        if (!(admin_name, password)) {
            return res.status(400).json({ message: "All Input required" });
        }

        const verifyAdminname = await adminModel.findOne({ admin_name });
        // console.log(verifyAdminname);
        if (verifyAdminname) {
            bcrypt.compare(password, verifyAdminname.password).then(match => {
                if (match) {
                    var data = ({
                        admin: {
                            admin_name: admin_name
                        }
                    });
                    var token = jwt.sign(data, process.env.JWT_SECRET_KEY);
                    res.status(200).json({
                        token: token,
                        message: 'Admin Logged In Successfully',
                        status: 200
                    });
                }
                else {
                    return res.status(400).json({ message: "Invalid Credential" });
                }
            })
        }
        else {
            res.status(400).json({ message: "Invalid Credential" });
        }
    }
    catch (error) {
        console.log(error);
    }
}

//5th API:Fetch AdminData based on token Authentication from Database using POST Method on API Path:http://127.0.0.1:4000/admin/getadmindatausingtoken 
const getAdminDataUsingToken = async (req, res) => {
    try {
        const admin_name = req.admin_name;
        const getData = await adminModel.findOne({ admin_name }).select("-password");
        if (getData) {
            res.status(200).send(getData);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}
module.exports = { fetchAdminProfileData, registerAdminProfile, verifyRegisterAdmin, verifyAdminLogin, getAdminDataUsingToken };