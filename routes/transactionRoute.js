const express = require("express")
// const { userModel } = require("../models/userModel")
const { signupController, signinController } = require("../controllers/authController");
const { categoryModel } = require("../models/categoryModel");
const { transactionModel } = require("../models/transactionModel");
const {addTransaction,delTransaction,updTransaction}=require("../controllers/transactionController")

const transactionRouter = express.Router()
transactionRouter.post("/transaction", addTransaction);

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

transactionRouter.patch("/transaction",updTransaction)

transactionRouter.delete("/transaction/:transactionId",delTransaction)
  
module.exports = {transactionRouter};