const jwt = require("jsonwebtoken");

const generateToken = (admin) => {

    return jwt.sign(
        {
        id:admin.id,
        username: admin.username,
        role:admin.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"1d"
        }
    );
};

module.exports = generateToken;