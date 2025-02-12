const jwt = require("jsonwebtoken")
const { signupbody } = require("../helper/zod")
require('dotenv').config()
const { hashPassword, comparePassword } = require("../helper/encryptionHelpeer")
const { userModel } = require("../models/userModel")

const signupController=async(req,res)=>{
    const username = req.body.username
    const password = req.body.password
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const pasrsedDataWithSuccess=signupbody.safeParse(req.body); //req.body is the input body 
    if(!pasrsedDataWithSuccess.success){
        const error_details = JSON.parse(pasrsedDataWithSuccess.error.message)[0].message || "Error while signing you up"
        res.status(400).json({
            message:"Incorrect format",
            error:error_details
        })
        return 
    }
    try {
        const found = await userModel.findOne({
            username:username,
        })
        //register
        if(!found){
        
            const hashed = await hashPassword(password);
            const newuser = await userModel.create({
                username:username,
                password:hashed,
                firstname,
                lastname
            })
            
            res.status(200).json({success:"user created"})
            return
        }else{
            //user already exists
            res.status(409).json({error:"User already exists"})
        }

    } catch (error) {
        res.status(500).json({error:error})
    }
}
const signinController=async(req,res)=>{

    const username = req.body.username
    const password = req.body.password

    const found = await userModel.findOne({username});
    if(!found){
        res.json({error:"User does not exist"})
    }else{
        const match = await comparePassword(password,found.password)
        if(match){
            //return cookie
            const key = process.env.JWT_SECRET
            const token = await jwt.sign({username:found.username,id:found._id},key,{expiresIn: '1h'})
            res.cookie("token",token,{
                httpOnly:true,
                secure: process.env.NODE_ENV === 'production'?true:false,
                // sameSite: 'None',
            }).json({username:found.username,firstname:found.firstname,lastname:found.lastname})
        }else{
            //error pass not match
            res.status(400).json({error:"Password does not match"})
        }
    }
    
}
module.exports={
    signupController,
    signinController
}