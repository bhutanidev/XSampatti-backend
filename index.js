const express = require('express');
const { connectmongo } = require('./helper/db');
const cookieParser = require("cookie-parser");
const { authRouter } = require('./routes/authRoutes');
const { transactionRouter } = require('./routes/transactionRoute');
const { attachUser } = require('./middlewares/authMiddleware');
const app = express();
var cors = require('cors')
require("dotenv").config()

var corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
}
app.use(cors(corsOptions))

app.use(express.json())
app.use(cookieParser(process.env.COOKIE))

const PORT = 3000;

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`))
app.use('/api',authRouter)
app.use('/api',attachUser,transactionRouter)

connectmongo()