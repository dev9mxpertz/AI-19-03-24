const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema({
    Name: {
        type: String,
    },
    Email_id: {
        type: String,
        required: true,
    },
    Phone_Number: {
      type:Number,
    },
    EmployeeId:{
        type:String,
        unique:true
    },
    Address: {
      type:String,
    },
    Join_Date: 
        {
            type: Date, 
        },
    Salary: 
        {
         type: String,    
        },
       
        resetPasswordToken: String,
        resetPasswordExpires: Date,
    },
   
);

module.exports = mongoose.model("employee", employeeSchema);