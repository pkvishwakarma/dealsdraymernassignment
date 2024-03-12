const express = require("express");
const employeeModel = require("../../model/employee_model/employee_model_schema");

//1st API:Fetching all Employee Profile Data from Database using GET Method on API Path:http://127.0.0.1:4000/admin/employeedata 
const fetchEmployeeData = (req, res) => {
    try {
        employeeModel.find({}).then((data) => {
            res.send(data);
        })
    }
    catch (error) {
        console.log(error.massage);
    }
};

//--Fetching Email Wise Employee details using GET Method on API Path:http://127.0.0.1:4000/admin/emailwiseemployeeinfo/:email
const fetchEmailWiseEmployeeInfo=(req,res)=>{
    var email=req.params.email;
    try {
        employeeModel.findOne({email}).then((empDetail)=>{
        res.status(200).send(empDetail);
        })
    } catch (error) {
        console.log(error);
    }
}

//2nd API:Create Employee Profile Data into Database using POST Method on API Path:http://127.0.0.1:4000/admin/createemployeedata 
const createEmployeeData = async (req, res) => {
    const { employee_name, email, mobile, designation, gender, course } = req.body;
    try {
        if (!(employee_name && email && mobile && designation && gender && course)) {
            res.send("All Inputs Required");
            return;
        };
        var oldEmployee = await employeeModel.findOne({ email: email.toLowerCase() });
        if (oldEmployee) {
            return res.status(400).json({ message: "Employee Profile Already Exist" });
        }

        var employeeCount = 1;
        var employeeOldId = await employeeModel.findOne({ employee_id: `Employee${employeeCount}` });

        //Verifying employeeid with database and Generating New employeeid for New employee during employee creating..
        while (employeeOldId) {
            employeeCount = employeeCount + 1;
            employeeOldId = await employeeModel.findOne({ employee_id: `Employee${employeeCount}` });
        }
        var currentDate = new Date();
        var month=['Jan','Feb','Mar','Apr','May','Jun','July','Aug','Sep','Oct','Nov','Dec'];
        var yyyy = currentDate.getFullYear();
        var mm = currentDate.getMonth();// Months start at 0!
        var dd = currentDate.getDate();
        await employeeModel.create({ employee_id: `Employee${employeeCount}`, employee_name, email: email.toLowerCase(), mobile, designation, gender, course, profileimg: req.file.filename, createdate: `${dd}-${month[mm]}-${yyyy}` }).then((empData) => {
            console.log(empData);
        });

        res.status(200).json({
            message: 'Employee Profile Created Successfully',
            status: 200
        });
    }
    catch (error) {
        console.log(error);
    }
};

//3rd API:Modify Employee Profile Data into Database using PUT Method on API Path:http://127.0.0.1:4000/admin/modifyemployeeinfo/:email 
const modifyEmployeeInfo = async (req, res) => {
    var emailid = req.params.email;
    var { employee_name, email, mobile, designation, gender, course } = req.body;
    try {
        if (!(employee_name && email && mobile && designation && gender && course)) {
            return res.status(400).json({ message: "Input can't be Empty" });
        }

        var currentDate = new Date();
        var month=['Jan','Feb','Mar','Apr','May','Jun','July','Aug','Sep','Oct','Nov','Dec'];
        var yyyy = currentDate.getFullYear();
        var mm = currentDate.getMonth();// Months start at 0!
        var dd = currentDate.getDate();

        await employeeModel.findOneAndUpdate({ email:emailid }, { employee_name, email, mobile, designation, gender, course,profileimg:req.body.profileimg?req.body.profileimg:req.file.filename, createdate: `${dd}-${month[mm]}-${yyyy}` })
        .then((modifiedEmpData) => {
            console.log(modifiedEmpData);
        });

        res.status(200).json({
            message: 'Employee Profile Updated Successfully',
            status: 200
        });
    }
    catch (error) {
        console.log(error.message);
    }
}

//4th API:Verify Employee Email from Database using POST Method on API Path:http://127.0.0.1:4000/admin/verifyemployeeemail 
const verifyEmployeeEmail= async(req,res)=>{
    const {email}=req.body;
    try {
        const oldEmail= await employeeModel.findOne({email:email.toLowerCase()});
        // console.log(oldEmail);
        if(oldEmail){
            res.status(400).send("This EmailId is Already Registred");
        }
        else{
            res.status(200).send("Email Verified");
        }
    } catch (error) {
        console.log(error);
    }
}

//5th API: Delete Employee Data Email wise from Database using DELETE Method on API Path:http://127.0.0.1:4000/admin/removeemployeedata/:email
const removeEmployeeData=async(req,res)=>{
    var emailid=req.params.email;
    try {
        await employeeModel.deleteOne({email:emailid});
        res.status(200).send("Employee Profile Deleted Successfully");
    } catch (error) {
        console.log(error);
    }
}

module.exports = { fetchEmployeeData, fetchEmailWiseEmployeeInfo, createEmployeeData, modifyEmployeeInfo, verifyEmployeeEmail,removeEmployeeData};