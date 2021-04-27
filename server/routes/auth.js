const express = require("express");
const jwt = require("jsonwebtoken");
const controller = require("../controllers/User");

const router = express.Router();

const verifyToken = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) return res.status(400).send("Access Denied");

    const payload = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    req.userID = payload._id;
    next();
};

router.get("/", controller.testAPI);
router.get("/profile", verifyToken, controller.getUser);
router.get("/users", controller.getAllUsers);
router.post("/register", controller.register);
router.post("/login", controller.login);

module.exports = router;
