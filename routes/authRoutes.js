const express = require("express")
// const { userModel } = require("../models/userModel")
const { signupController, signinController } = require("../controllers/authController")
const cookieParser = require("cookie-parser")
const { userModel } = require("../models/userModel")
const { attachUser } = require("../middlewares/authMiddleware")

const authRouter = express.Router()

authRouter.post("/signup",signupController)
authRouter.post("/signin",signinController)
authRouter.get("/profile",attachUser, async(req, res) => {
    // console.log(req.id)
    
    const find = await userModel.findById(req.id).select("username firstname lastname")
    if(!find){
        return res.status(400).json({error:"User not found"})
    }
    // console.log(find);
    
    return res.json({...find._doc})
});
authRouter.post("/logout", (req, res) => {
    res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "Strict" });
    return res.json({ message: "Logged out successfully" });
});
module.exports={
    authRouter
}