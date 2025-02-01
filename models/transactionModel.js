const mongoose= require("mongoose")


const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    amount: { type: Number, required: true },  // Numeric and required
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    date: { type: Date, required: true },  // Required date field
    description: { type: String, trim: true }, // Optional description
    // createdAt: { type: Date, default: Date.now } // Automatically stores when added
});

const transactionModel = mongoose.model("Transaction", transactionSchema);

module.exports={
    transactionModel
}