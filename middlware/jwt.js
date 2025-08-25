const jwt=require("jsonwebtoken")

const authentication=(req,res,next)=>{
    const token=req.headers['authorization']?.split(" ")[1]
    if(!token){
        return res.status(403).json({message:"Token not found!"})
    }
    try {
        const decryptedToken=jwt.verify(token,"key")
        req.id=decryptedToken.id
        next()
    } catch (error) {
        res.status(500).json({message:"Server error",error})
    }
}

module.exports=authentication