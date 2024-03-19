const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { Schema } = mongoose;
const userModel = new mongoose.Schema({
    username:{
        type:String,
        trim:true,
        required:true,
        minlength:[4,"username must have atleast 4 characters"]
    },
    email:{
        type:String,
        trim:true,
        required:true,
        lowercase:true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Invalid email address",
        ],
    },
    password:{ 
        type: String,
        // required:true,
    },
   
    role: {
        type: String,
        default: 'user'
    },
    otp: {
        type: String,
        required: false
    },
    otpExpires: {
        type: Date,
        required: false
    },
    notifications: [{
        type: Schema.Types.ObjectId,
        message: String,
        createdAt: { type: Date, default: Date.now },
        read: { type: Boolean, default: false },
        ref: 'Notification'
      }]
    });



userModel.pre("save", async function(next){
    try {
        if (!this.isModified("password")) {
            return next();
        }
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUND, 10));
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

userModel.statics.comparePassword = async function(enteredPassword, storedPassword) {
    try {
        return await bcrypt.compare(enteredPassword, storedPassword);
    } catch (error) {
        throw error;
    }
};

userModel.methods.jwttoken = async function() {
    try {
        const token = jwt.sign({ id: this._id,role:this.role }, process.env.JWT_SECRET_KEY, { expiresIn: "1hr" });
        return token;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const User = mongoose.model("User", userModel);

module.exports = User;
