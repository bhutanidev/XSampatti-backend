const { categoryModel } = require( "../models/categoryModel")
const { transactionModel } = require("../models/transactionModel");
const mongoose = require("mongoose");
const addTransaction=async (req, res) => {
    let { amount, category, date , description } = req.body;
    //
    console.log(req.body);
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
    //
    console.log("category id is",cat_id);
    
    const newTransaction = await transactionModel.create({
        userId:req.id,
        amount,
        category:cat_id,
        date:datecreated,
        description,
 
    })
    
    const populated_transaction=await transactionModel.findById(newTransaction._id).populate("category").select("_id amount category date description")
    //new trnx ki kya kya fields chhaiye
    if(!newTransaction || !populated_transaction){
        return res.status(400).json({error:"somethig wrong with database"})
    }else{
        return res.status(200).json({newTransaction:populated_transaction})
    }
}
const getTransaction=async(req,res)=>{
    const id = req.id 
    //above is user id
    try {
        const all_transactions=await transactionModel.find({
            userId:id
        }).populate("category").select("_id amount category date description")
        return res.status(200).json({transactions:all_transactions})
    } catch (error) {
        return res.status(500).json({error:error})
    }
}

const delTransaction=async(req,res)=>{
    const id = req.params.transactionId.trim(); 
    // console.log(req.params)
    try {
        const deletedobj = await transactionModel.findByIdAndDelete(id)
        if(!deletedobj){
            return res.json({error:"Transactin not found"})
        }
            return res.json({success:"Deleted successfully"})
    } catch (error) {
        return res.json({error:error})
    }

}

// const updTransaction=async(req,res)=>{
//     const {amount,category,date,description,transactionId}=req.body
//     const id=req.id; // it means that we ahve to do withcredentials true
//     let updateobj = {};
//     if(!transactionId){
//         return res.json({error:"transaction id is required"})
//     }
//     if(amount)updateobj.amount = amount
//     if(category)updateobj.category = category
//     if(date)updateobj.date = date
//     if(description)updateobj.description = description
//     try {
//             const find = await transactionModel.findById(transactionId).populate("category")
//             console.log(updateobj)
//             if(!find){
//                 return res.json({error:"no such transaction"})
//             }
//             if(find.userId.toString()!==id){
//                 return res.json({error:"Not allowed to change this transaction"})
//             }
//             const updated = await transactionModel.findByIdAndUpdate(transactionId,{
//                 ...updateobj
//             },{new:true})
//             console.log(updated)
//     } catch (error) {
//         return res.json({error:error})
//     }
    
//     return res.json({success:"Updated successfully"})

// }
const updTransaction = async (req, res) => {
    const { amount, category, date, description, transactionId } = req.body;
    const id = req.id;

    // Debug logging
    console.log("Request body:", req.body);
    console.log("User ID:", id);

    try {
        // Input validation
        if (!transactionId) {
            console.log("Missing transactionId");
            return res.status(400).json({ error: "Transaction ID is required" });
        }

        // Validate transaction ID format
        if (!mongoose.Types.ObjectId.isValid(transactionId)) {
            console.log("Invalid transaction ID format:", transactionId);
            return res.status(400).json({ error: "Invalid transaction ID format" });
        }

        // Build update object with validation
        const updateObj = {};
        
        if (amount !== undefined) {
            const numAmount = Number(amount);
            if (isNaN(numAmount)) {
                console.log("Invalid amount format:", amount);
                return res.status(400).json({ error: "Invalid amount format" });
            }
            updateObj.amount = numAmount;
        }

        if (category !== undefined) {
            updateObj.category = category; // Store as is for now, remove category model dependency
        }

        if (date) {
            const dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) {
                console.log("Invalid date format:", date);
                return res.status(400).json({ error: "Invalid date format" });
            }
            updateObj.date = dateObj;
        }

        if (description !== undefined) {
            updateObj.description = description;
        }

        console.log("Update object:", updateObj);

        // Find existing transaction
        const existingTransaction = await transactionModel.findById(transactionId);
        
        if (!existingTransaction) {
            console.log("Transaction not found:", transactionId);
            return res.status(404).json({ error: "Transaction not found" });
        }

        console.log("Existing transaction:", existingTransaction);

        // Verify ownership
        if (existingTransaction.userId.toString() !== id) {
            console.log("Authorization failed. Transaction user:", existingTransaction.userId, "Request user:", id);
            return res.status(403).json({ error: "Not authorized to update this transaction" });
        }

        // Update transaction
        const updated = await transactionModel.findByIdAndUpdate(
            transactionId,
            { $set: updateObj },
            { 
                new: true,
                runValidators: true
            }
        ).populate("category");

        console.log("Updated transaction:", updated);

        if (!updated) {
            console.log("Update failed for transaction:", transactionId);
            return res.status(500).json({ error: "Failed to update transaction" });
        }

        return res.status(200).json({ 
            success: "Updated successfully",
            transaction: updated
        });

    } catch (error) {
        console.error("Transaction update error details:", {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        
        return res.status(500).json({ 
            error: "An error occurred while updating the transaction",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const getCatogories=async(req,res)=>{
    
    const {category}=req.body;
    

}

// Get current month's total sum
const getCurrentMonthSum = async (req, res) => {
    const userId = req.id;

    try {
        const startOfMonth = new Date(new Date().setDate(1)); // First day of the month
        const today = new Date(); // Current date
        
        const pipeline = [
          {
            $match: {
              userId: new mongoose.Types.ObjectId(userId), // Ensure correct ObjectId type
              date: {
                $exists: true,
                $gte: startOfMonth,
                $lte: today,
              },
            },
          },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$amount" },
            },
          },
        ];
        
        const result = await transactionModel.aggregate(pipeline);
        console.log(result);
        return res.json({
            success: true,
            totalAmount: result[0]?.totalAmount || 0
        });

    } catch (err) {
        console.error('Error calculating month sum:', err);
        return res.status(500).json({
            success: false,
            error: 'Error calculating month sum'
        });
    }
};

// Get current week's total sum
const getCurrentWeekSum = async (req, res) => {
    const userId = req.id;

    try {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setHours(0, 0, 0, 0);
        // Set to Monday of current week
        startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));

        const pipeline = [
            {
              $match: {
                userId: new mongoose.Types.ObjectId(userId), // Ensure correct ObjectId type
                date: {
                  $exists: true,
                  $gte: startOfWeek,
                  $lte: today,
                },
              },
            },
            {
              $group: {
                _id: null,
                totalAmount: { $sum: "$amount" },
              },
            },
          ];
          
          const result = await transactionModel.aggregate(pipeline);
          console.log(result);

        return res.json({
            success: true,
            totalAmount: result[0]?.totalAmount || 0
        });

    } catch (err) {
        console.error('Error calculating week sum:', err);
        return res.status(500).json({
            success: false,
            error: 'Error calculating week sum'
        });
    }
};


module.exports={
    addTransaction,
    delTransaction,
    updTransaction,
    getTransaction,
    getCatogories,
    getCurrentWeekSum,
    getCurrentMonthSum

}