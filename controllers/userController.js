const db=require("../db/config")
const nodemailerSender=require("./nodemailerController")
const jwt=require("jsonwebtoken")
const randomString=require("randomstring")

let otpObj={}

exports.onRegister=async(req,res)=>{
    const {username,email,password}=req.body
    try {
        await db.query("INSERT INTO users(username,email,password) VALUES($1,$2,$3)",[username,email,password])
        res.status(200).json({message:"Registration success!"})
    } catch (error) {
        console.log(error)
        res.status(500).json({messager:'Server error',error})
    }
}

exports.onLogin=async(req,res)=>{
    console.log("inside!")
    const {email}=req.body
    try {
       let {rows}= await db.query("SELECT * FROM USERS WHERE EMAIL=$1",[email])
       console.log(rows)
       if(rows.length<=0){
        return res.status(404).json({message:"User not found!"})
       }
        let randomNumber=randomString.generate({charset:'numeric',length:4})
        const resp=await nodemailerSender(email,randomNumber)
         otpObj={
            otp:randomNumber,
            id:rows[0].id,
            timer:new Date().getTime()+30*1000
        }
        console.log(otpObj)
        res.status(200).json({message:resp.message})
    } catch (error) {
        res.status(200).json({message:""})
    }
}

exports.onOTPAccept=async(req,res)=>{
    const {otp}=req.params
    console.log(otp)
    let timer=new Date().getTime()
    try {
        if(timer>otpObj['timer']){
            otpObj={}
            return res.status(403).json({message:"OTP expired!"})
        }

        if(otp!=otpObj['otp']){
            return res.status(401).json({message:"Invalid OTP"})
        }

        const token=jwt.sign({_id:otpObj.id},'key',{expiresIn:'1m'})
        const RefreshToken=jwt.sign({_id:otpObj.id},'key',{expiresIn:'15min'})
        res.cookie("refreshtoken",RefreshToken,{maxAge:15*60*1000,httpOnly:true,secure:false})
        res.status(200).json({message:"Login success!",token})

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Something wrong!",error})
    }
}


exports.onGetuserDetails=async(req,res)=>{
    const id=req.id
    try {
        const {rows}=await db.query("SELECT * FROM USERS WHERE id=$1",[id])
        res.status(200).json({data:rows})
    } catch (error) {
        res.status(500).json({message:'Server error',error})
    }
}



exports.refreshToken = (req, res) => {
    const refreshToken = req.cookies?.refreshtoken;
    if (!refreshToken) {
        return res.status(404).json({ message: 'Refresh token required!' });
    }
    try {
        const decoded = jwt.verify(refreshToken,"key");
        const newAccessToken=jwt.sign({id:decoded.id},"key",{expiresIn:"15m"})

          return res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        console.log(error)
        return res.status(403).json({ message: 'Invalid or expired refresh token!' });
    }
};

