const isAdmin = (req, res, next) => {
    if(req.user.role !== "ADMIN") {
        return res.status(403).json({
            Success: false,
            message: "Access Denied, Admin Only..🤨"
        });
    }
    next();
};

module.exports = isAdmin;