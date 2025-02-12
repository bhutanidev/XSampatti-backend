const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  amount: {type: Number,required: true,min: [0, 'Amount cannot be negative']},
  dayOfMonth: {type: Number,required: [true, 'Day of month is required'],min: [1, 'Day must be between 1 and 31'],max: [31, 'Day must be between 1 and 31']},
  toBePaid: {type: Boolean,default: true},
  description: {type: String,maxLength: [500, 'Description cannot be more than 500 characters']},
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
});

const ReminderModel = mongoose.model("Reminders",ReminderSchema)

module.exports={
    ReminderModel
}