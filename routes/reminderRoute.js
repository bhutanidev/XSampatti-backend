const express = require("express")
const { categoryModel } = require("../models/categoryModel")
const { ReminderModel } = require("../models/reminderModel")

const reminderRouter = express.Router()

reminderRouter.post('/reminder',async(req,res)=>{
    let {amount,dayOfMonth,toBePaid,description,category} = req.body
    if(!amount || !dayOfMonth || !toBePaid || !category){
        return res.status(400).json({error:"Please fill all the required fields"})
    }
    if(!description){
        description=""
    }
    amount = parseInt(amount)
    dayOfMonth=parseInt(dayOfMonth)
    category  = category.toLowerCase()
    try {
        const find = await categoryModel.findOne({
            name:category
        })
        if(!find){
            const newcat = await categoryModel.create({
                name:category
            })
            cat_id = newcat._id
        }else{
            cat_id=find._id
        }
        const newReminder = await ReminderModel.create({
            userId:req.id,
            amount,
            category:cat_id,
            dayOfMonth,
            toBePaid,
            description
     
        })
        const findrem = await ReminderModel.findOne({userId:req.id,_id:newReminder.id}).populate("category")
        if(!newReminder || !findrem){
            return res.status(400).json({error:"somethig wrong with database"})
        }else{
            return res.status(200).json({success:"New reminder added",findrem})
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Database error"})
    }
})

reminderRouter.get('/reminder',async(req,res)=>{
    const id = req.id
    try {
        const all_reminder=await ReminderModel.find({
            userId:id
        }).populate("category").select("_id amount category toBePaid description dayOfMonth")
        return res.status(200).json({remnders:all_reminder})
    } catch (error) {
        return res.status(500).json({error:error})
    }
})
reminderRouter.delete("/reminder/:reminderId",async(req,res)=>{
    const id = req.params.reminderId
    try {
        const deletedobj = await ReminderModel.findOneAndDelete({_id:id,userId:req.id})
        if(!deletedobj){
            return res.status(400).json({error:"Transactin not found"})
        }
            return res.status(200).json({success:"Deleted successfully"})
    } catch (error) {
        return res.status(500).json({error:"Database error"})
    }
})
reminderRouter.patch("/reminder/",async(req,res)=>{
    let {amount,dayOfMonth,description,category,reminderId} = req.body
    let updateobj = {};
    if(!reminderId){
        return res.json({error:"transaction id is required"})
    }
    if(amount)updateobj.amount = amount
    if(category)updateobj.category = category
    if(dayOfMonth)updateobj.date = date
    if(description)updateobj.description = description
    try {
            const find = await ReminderModel.findById(transactionId)
            console.log(updateobj)
            if(!find){
                return res.status(400).json({error:"no such transaction"})
            }
            if(find.userId.toString()!==id){
                return res.status(400).json({error:"Not allowed to change this transaction"})
            }
            const updated = await ReminderModel.findByIdAndUpdate(transactionId,{
                ...updateobj
            },{new:true})
            return res.json({success:"updated successfully",updated})
    } catch (error) {
        return res.json({error:error})
    }
    

})
module.exports={
    reminderRouter
}