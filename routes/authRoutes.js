const express = require("express")
// const { userModel } = require("../models/userModel")
const { signupController, signinController } = require("../controllers/authController")
const cookieParser = require("cookie-parser")

const authRouter = express.Router()

authRouter.post("/signup",signupController)
authRouter.post("/signin",signinController)
authRouter.post("/logout", (req, res) => {
    res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "Strict" });
    return res.json({ message: "Logged out successfully" });
});
module.exports={
    authRouter
}