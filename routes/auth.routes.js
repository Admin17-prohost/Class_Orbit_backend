const express = require("express");
const router = express.Router();

const verifytoken = require("../middleware/auth.middleware");


const {Login} = require("../controllers/auth.controller");

router.post("/login", Login);

router.get("/test", verifytoken, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

module.exports = router;