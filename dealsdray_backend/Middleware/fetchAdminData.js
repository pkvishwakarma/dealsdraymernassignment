const jwt = require("jsonwebtoken");

const fetchAdminData = (req, res, next) => {
    //Get the user from jwt token and add id to req object
    const token=req.header("token");
    if (!token) {
       return res.status(401).json({ error: "Please Authenticate using a Valid Token" });
    }
    try {
        const adminData = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.admin_name = adminData.admin.admin_name;
        next();
    } catch (error) {
        // console.log(error);
        res.status(401).json({ error: "Please Authenticate using a Valid Token" });
    }
}

module.exports = fetchAdminData;