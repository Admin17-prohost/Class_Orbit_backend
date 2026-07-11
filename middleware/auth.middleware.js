const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader) {
            return res.status(401).json({
                Success: false,
                message: "Access Denied, Token is Missing..😔"
            });
        }

        const token = authHeader.split(" ")[1];

        if(!token) {
            return res.status(401).json({
                Success: false,
                message: "Access Denied, Token is Missing..😔"
            });
        }


        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            Success: false,
            message: "Invalid Token..😔"
        });
    }
};

module.exports = verifyToken;