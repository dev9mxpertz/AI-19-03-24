const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");

exports.sendmail = async function (req, user) {
    try {
        // Generate an OTP using otp-generator
        const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });

        // Set OTP and expiration on user model 
        const otpExpirationTime = 300000; // 5 minutes in milliseconds
        user.otp = otp;
        user.otpExpires = Date.now() + otpExpirationTime;
        await user.save();

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: "dushyantshrivas25@gmail.com",
                pass: "xakr gxxs qjyy wqnp",
            },
        });

        const mailOptions = {
            from: "dushyantshrivas25@gmail.com",
            to: user.email,
            subject: "OTP for Password Reset",
            text: `Your OTP for password reset is: ${otp}. This OTP is valid for 5 minutes.`,
        };

        await transporter.sendMail(mailOptions);
        console.log('OTP sent to:', user.email);
    } catch (error) {
        console.error('OTP Send Error:', error);
        throw error;
    }
};



