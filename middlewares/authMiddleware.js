const jwt = require("jsonwebtoken")
const attachUser = async(req,res,next)=>{
    const token = req.cookies.token
    try {
        if(!token){
            res.json({error:"No token found"})
            return
        }
        const key  = process.env.JWT_SECRET
    
        const decoded = await jwt.verify(token,key)
    
        if(decoded && typeof decoded === 'object'){
            req.id = decoded.id
            next()
            return
        }else{
            res.status(403).json({error:"Not logged in or invalid token"})
        }
    } catch (error) {
        console.error(error)
        res.status(401).json({error:"Invalid token"})
    }
}

module.exports={attachUser}