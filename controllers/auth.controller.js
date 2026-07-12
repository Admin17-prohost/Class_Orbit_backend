const bcrypt = require("bcrypt");

const Admin = require("../models/admin_model");
const Hod = require("../models/hod_model");
const Staff = require("../models/staff_model");
const Class = require("../models/class_model");
const Official = require("../models/official_model")

const generateToken = require("../utils/generateToken");

//  Login 

const Login = async (req, res) => {
    try { 

        const models = [ Admin, Hod, Staff, Class, Official ];

        const { username, password } = req.body;

        //Validation

        if (!username || !password) {
                return res.status(400).json({
                success: false,
                message: "Username and Password are required."
            });
        }

        // Check Username
        let user = null;
        for(const Model of models){
         user = await Model.findOne({ where: { username } });
         if(user) break;
        }

        if (!user){
            return res.status(404).json({
                success: false,
                message: "User is Not Found..😔"
            });
        }

    // Password Check 
    const isMatch = await bcrypt.compare(password, user.password);
        
    if (!isMatch){
        return res.status(401).json({
            success: false,
            message: "Invalid Password..😔"
        });
    }

   const token = generateToken(user);

   return res.status(200).json({
    success: true,
    message: "Login Successfully..😎",
    token,
    user: {
        id: user.id,
        username: user.username,
        role: user.role
        }
    });

    }    catch(error) { 
        console.error("Error in Login:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error..😔"
        });
       
     }

};

module.exports = { Login };