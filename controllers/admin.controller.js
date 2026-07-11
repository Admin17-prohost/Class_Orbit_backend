const bcrypt = require("bcrypt");
const Admin = require("../models/admin_model");
const generateToken = require("../utils/generateToken");

//  Login Admin

const adminLogin = async (req, res) => {
    try { 
        const { username, password } = req.body;

        // Check Username
        const admin  = await Admin.findOne({ where: { username }});

        if (!admin){
            return res.status(404).json({
                Success: false,
                message: "Admin is Not Found..😔"
            });
        }

    // Password Check 
    const isMatch = await bcrypt.compare(password, admin.password);
        
    if (!isMatch){
        return res.status(401).json({
            Success: false,
            message: "Invalid Password..😔"
        });
    }

    const token = generateToken(admin);

    return res.status(200).json({
        Success: true,
        message: "Admin Login Successfully..😎",
        token
        });

    }    catch(error) { 
        console.error("Error in adminLogin:", error);
        return res.status(500).json({
            Success: false,
            message: "Internal Server Error..😔"
        });
       
    }

};

module.exports = { adminLogin, };