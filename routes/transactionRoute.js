const express = require("express")
// const { userModel } = require("../models/userModel")
const { signupController, signinController } = require("../controllers/authController");
const { categoryModel } = require("../models/categoryModel");
const { transactionModel } = require("../models/transactionModel");


const transactionRouter = express.Router()
transactionRouter.post("/transaction", async (req, res) => {
    let { amount, category, date , description } = req.body;
    amount=parseInt(amount)
    if(!description)description=""
    category  = category.toLowerCase()
    const find = await categoryModel.findOne({
        name:category
    })
    const datecreated = new Date(date)
    let cat_id;
    if(!find){
        const newcat = await categoryModel.create({
            name:category
        })
        cat_id = newcat._id
    }else{
        cat_id=find._id
    }
    // console.log(cat_id);
    
    const newTransaction = await transactionModel.create({
        userId:req.id,
        amount,
        category:cat_id,
        date:datecreated,
        description,
    })
    const findrem = await transactionModel.findOne({userId:req.id,_id:newTransaction.id}).populate("category")
    if(!newTransaction){
        return res.status(400).json({error:"somethig wrong with database"})
    }else{
        return res.status(200).json({findrem})
    }
});

transactionRouter.get('/transaction',async(req,res)=>{
    const id = req.id
    try {
        const all_transactions=await transactionModel.find({
            userId:id
        }).limit(10).populate("category").select("_id amount category date description")
        return res.status(200).json({transactions:all_transactions})
    } catch (error) {
        return res.status(500).json({error:error})
    }
})

transactionRouter.get("/transaction/date/:date/:page", async (req, res) => {
    try {
      const { date , page } = req.params;
      const pnum = parseInt(page)
      console.log(date,page)
      const LIMIT_PER_PAGE = 10
      // Convert date string to start and end of the day (UTC)
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
  
      // Find transactions within the date range
      const transactions = await transactionModel.find({
        userId:req.id,
        date: { $gte: startOfDay, $lte: endOfDay },
      }).limit(LIMIT_PER_PAGE)
      .skip((pnum-1)*LIMIT_PER_PAGE)
      .sort({date:-1});
  
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Server Error" });
    }
});

transactionRouter.patch("/transaction",async(req,res)=>{
    const {amount,category,date,description,transactionId}=req.body
    let updateobj = {};
    if(!transactionId){
        return res.json({error:"transaction id is required"})
    }
    if(amount)updateobj.amount = amount
    if(category)updateobj.category = category
    if(date)updateobj.date = date
    if(description)updateobj.description = description
    try {
            const find = await transactionModel.findById(transactionId)
            console.log(updateobj)
            if(!find){
                return res.json({error:"no such transaction"})
            }
            if(find.userId.toString()!==req.id){
                return res.json({error:"Not allowed to change this transaction"})
            }
            const updated = await transactionModel.findByIdAndUpdate(transactionId,{
                ...updateobj
            },{new:true})
            return res.json({success:"updated successfully",updated})
    } catch (error) {
        return res.json({error:error})
    }
    

})

transactionRouter.delete("/transaction/:transactionId",async(req,res)=>{
    const id = req.params.transactionId
    try {
        const deletedobj = await transactionModel.findOneAndDelete({_id:id,userId:req.id})
        if(!deletedobj){
            return res.json({error:"Transactin not found"})
        }
            return res.json({success:"Deleted successfully"})
    } catch (error) {
        return res.json({error:error})
    }

})
  
module.exports = {transactionRouter};