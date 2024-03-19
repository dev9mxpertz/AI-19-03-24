const mongoose = require('mongoose');

const chatbotprofileusermodel = new mongoose.Schema({
 Avatar:{
type:String,
default:" "
 },
 company_name:{
    type:String
 }
})

const chatBotProfile = new mongoose.model("chatBotProfile",chatbotprofileusermodel);

module.exports = chatBotProfile;