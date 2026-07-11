const express = require("express");
const router = express.Router();

const verifytoken = require("../middleware/auth.middleware");


const {adminLogin} = require("../controllers/admin.controller");

router.post("/login", adminLogin);

router.get("/test", verifytoken, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

module.exports = router;