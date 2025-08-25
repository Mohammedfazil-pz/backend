const nodemailer=require("nodemailer")

const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'smohammedfazil433@gmail.com',
        pass:'rxrg krug ubfp qclc'
    },
})

const sendOTP=async(email,OTP)=>{
    
    const mailOptions={
        from:process.env.GOOGLEEMAIL,
        to:email,
        subject:'Login Verification',
        text:`Your OTP for login is ${OTP}`
    }

    try {
     await transporter.sendMail(mailOptions)
     return { status: 200, message: "Email send" };
    } catch (error) {
        console.log(error)
        return { success: 404, message: "Error occurred!", error: error.message };
    }

}

module.exports=sendOTP