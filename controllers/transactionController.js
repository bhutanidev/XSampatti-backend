const { categoryModel } = require( "../models/categoryModel")
const { transactionModel } = require("../models/transactionModel");
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
    if(!newTransaction){
        return res.status(400).json({error:"somethig wrong with database"})
    }else{
        return res.status(200).json({newTransaction})
    }
}
const getTransaction=async(req,res)=>{
    const id = req.id 
    //above is user id
    try {
        const all_transactions=await transactionModel.find({
            userId:id
        }).limit(10).populate("category").select("_id amount category date description")
        return res.status(200).json({transactions:all_transactions})
    } catch (error) {
        return res.status(500).json({error:error})
    }
}

const delTransaction=async(req,res)=>{
    const id = req.params.transactionId
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

const updTransaction=async(req,res)=>{
    const {amount,category,date,description,id,transactionId}=req.body
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
            if(find.userId.toString()!==id){
                return res.json({error:"Not allowed to change this transaction"})
            }
            const updated = await transactionModel.findByIdAndUpdate(transactionId,{
                ...updateobj
            },{new:true})
            console.log(updated)
    } catch (error) {
        return res.json({error:error})
    }
    
    return res.json({success:"updated successfully"})

}

const getCatogories=async(req,res)=>{
    const {category}=req.body;

}
module.exports={
    addTransaction,
    delTransaction,
    updTransaction,
    getTransaction,
    getCatogories

}