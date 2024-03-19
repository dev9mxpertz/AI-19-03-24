const mongoose = require("mongoose")

const Questionanswerschema = new mongoose.Schema({
 
    question:{
        type:String,
    },
    answer:{
        type:String
    }

})

const questionanswer = mongoose.model("questionanswer",Questionanswerschema)

module.exports = questionanswer;