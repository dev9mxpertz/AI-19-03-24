const mongoose = require("mongoose");
const {Schema} = mongoose;

const AdminuserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String
    },
    role:{
        type:String,
        default:"admin"
    },
    notifications: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Notification'
        }],
        default: []
    }
})


AdminuserSchema.pre("save", async function(next){
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

AdminuserSchema.statics.comparePassword = async function(enteredPassword, storedPassword) {
    try {
        return await bcrypt.compare(enteredPassword, storedPassword);
    } catch (error) {
        throw error;
    }
};

AdminuserSchema.methods.jwttoken = async function() {
    try {
        const token = jwt.sign({ id: this._id,role:this.role }, process.env.JWT_SECRET_KEY, { expiresIn: "1hr" });
        return token;
    } catch (error) {
        console.log(error);
        throw error;
    }
};


const Adminuser = mongoose.model("Adminuser",AdminuserSchema)
module.exports = Adminuser;