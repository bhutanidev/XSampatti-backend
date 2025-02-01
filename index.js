const express = require('express');
const { connectmongo } = require('./helper/db');
const cookieParser = require("cookie-parser");
const { authRouter } = require('./routes/authRoutes');
const { transactionRouter } = require('./routes/transactionRoute');
const { attachUser } = require('./middlewares/authMiddleware');
const app = express();
var cors = require('cors')
require("dotenv").config()

app.use(express.json())
app.use(cookieParser())


var corsOptions = {
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


app.use(cors(corsOptions))

const PORT = 3000;

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`))
app.use('/api',authRouter)
app.use('/api',attachUser,transactionRouter)

connectmongo()