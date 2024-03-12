const express=require("express");
const router=express.Router();
const {fetchAdminProfileData, registerAdminProfile, verifyRegisterAdmin, verifyAdminLogin, getAdminDataUsingToken}=require("../../controllers/admin_controllers/adminController");
const fetchAdminData = require("../../Middleware/fetchAdminData");
const multer=require("multer");
const path=require("path");
const {fetchEmployeeData, fetchEmailWiseEmployeeInfo, createEmployeeData, modifyEmployeeInfo,verifyEmployeeEmail,removeEmployeeData}=require("../../controllers/employee_controllers/employeeControllers");

const storage = multer.diskStorage({
    // destination: path.join(__dirname, "../../profileImage"),
    destination:function(req, file, cb){
        cb(
            null,"public/profileImage"
        )
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage: storage });

//Admin Routes..
router.route("/data").get(fetchAdminProfileData);
router.route("/registeradmin").post(registerAdminProfile);
router.route("/verifyregister").post(verifyRegisterAdmin);
router.route("/verifyadminlogin").post(verifyAdminLogin);
router.route("/getadmindatausingtoken").post(fetchAdminData,getAdminDataUsingToken);

// Employee Routes..
router.route("/employeedata").get(fetchEmployeeData);
router.route("/emailwiseemployeeinfo/:email").get(fetchEmailWiseEmployeeInfo);
router.route("/createemployeedata").post(upload.single("profileimg"),createEmployeeData);
router.route("/modifyemployeeinfo/:email").put(upload.single("profileimg"),modifyEmployeeInfo);
router.route("/verifyemployeeemail").post(verifyEmployeeEmail);
router.route("/removeemployeedata/:email").delete(removeEmployeeData);

module.exports=router;  