const express = require("express")
const {addReminder,getReminder,delReminder,updReminder}=require('../controllers/reminderController')

const reminderRouter = express.Router()

reminderRouter.post('/reminder',addReminder)
reminderRouter.get('/reminder',getReminder)
reminderRouter.delete("/reminder/:reminderId",delReminder)
reminderRouter.patch("/reminder/",updReminder)
module.exports={
    reminderRouter
}