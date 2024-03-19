const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({

    Company_Name:{
        type:String,
        required:true
    },
    Company_Email:{
        type:String,
    },
    Company_Phone:{
        type:String,
        required:true
    },
    Company_ID:{
        type:String,
        required:true
    },
    Company_Address:{
        type:String,
        required:true
    },
    Company_Type:{
        type:String,
        required:true
    },
    Other:{
        type:String,
        required:true
    }
})

const Company = mongoose.model("Company",CompanySchema);

module.exports = Company;