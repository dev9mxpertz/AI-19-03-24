
const chatprofile = require("../models/chatBotProfileModel")
const questionanswer = require('../models/QandAModel')
const botuserdetail = require("../models/botuserdetailModel")



exports.message = async (req,res)=>{
  const { message } = req.body;
  const response = await manager.process('en', message);
  res.send({ response: response.answer });
}

exports.chatprofile = async (req, res) => {
  const { company_name } = req.body;
  const userId = req.params.userId; // Get user ID from URL parameter

  try {
      // Check if a chat profile for the given user ID already exists
      const existingProfile = await chatprofile.findOne({ userId });

      if (existingProfile) {
          return res.status(400).json({ message: 'A chat bot profile for this user already exists' });
      }

      let Avatar = '';
      if (req.file) {
          Avatar = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
          // In a real scenario, you'd upload to your cloud storage and get the URL
      }

      // Create a new chat profile with the user ID
      const newBotProfile = new chatprofile({ 
          userId,
          Avatar, 
          company_name 
      });
      await newBotProfile.save();

      return res.json({ message: 'Chat bot profile added', newBotProfile });
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Failed to add chat bot profile', error });
  }
};


// Update chat profile
exports.updateChatProfile = async (req, res) => {
  const { company_name } = req.body;
  let Avatar = '';
  if (req.file) {
      Avatar = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      // In a real scenario, upload to your cloud storage and get the URL
  }
  try {
      // Find the chat profile to update based on _id
      const existingChatProfile = await chatprofile.findOne({ _id: req.params.id });

      if (!existingChatProfile) {
          return res.status(404).json({ message: 'Chat bot profile not found' });
      }
      // Update the chat profile details
      existingChatProfile.company_name = company_name;
      if (Avatar) { // Only update Avatar if a new file was uploaded
          existingChatProfile.Avatar = Avatar;
      }
      await existingChatProfile.save();

      return res.json({ message: 'Chat bot profile updated', updatedBotProfile: existingChatProfile });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to update chat bot profile', error });
  }
};

exports.getchatprofile = async (req, res) => {
  const userId = req.params.id; // Adjust depending on how the user object is structured in your token decoding process

  try {
    // Assuming your chatprofile model has a userId field to link profiles to users
    const profile = await chatprofile.findOne({ userId: userId });
    if (!profile) {
      return res.status(404).json({ message: 'Chatbot profile not found for this user' });
    }
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch chatbot profile', error: error });
  }
};

  exports.questionanswer = async (req, res) => {
    let { question, answer } = req.body;
    question = question.trim().toLowerCase();
    answer = answer.trim().toLowerCase();

    try {
      const newQandA = new questionanswer({question,answer});
      await newQandA.save();
        console.log("Received question:", question);
        console.log("Received answer:", answer);

        res.status(200).json({ message: "Question and answer saved successfully" });
    } catch (error) {
        console.error("Failed to save question and answer:", error);
        res.status(500).json({ message: "Failed to save question and answer", error: error });
    }
}

exports.getanswer =  async (req, res) => {
  let { question } = req.body;
  question = question.trim().toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");

  try {
    const regex = new RegExp("^" + question + "$", "i");
    const qaPair = await questionanswer.findOne({ question: regex }).exec();

    if (qaPair) {
      res.json({ success: true, answer: qaPair.answer });
    } else {
      res.json({ success: false, message: "Question not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllQandA = async (req, res) => {
  try {
      const allQandA = await questionanswer.find({}); // Find all documents in the collection
      res.status(200).json(allQandA); // Send back the data
  } catch (error) {
      console.error("Failed to retrieve questions and answers:", error);
      res.status(500).json({ message: "Failed to retrieve questions and answers", error: error });
  }
};

// API endpoint to delete a specific Q&A entry
exports.deleteQandA = async (req, res) => {
  const { id } = req.params; // Get the ID from the request parameters

  try {
      const deletedQandA = await questionanswer.findByIdAndDelete(id); // Find and delete the Q&A entry
      if (!deletedQandA) {
          return res.status(404).json({ message: "Q&A entry not found" });
      }
      res.status(200).json({ message: "Q&A entry deleted successfully", deletedQandA });
  } catch (error) {
      console.error("Failed to delete Q&A entry:", error);
      res.status(500).json({ message: "Failed to delete Q&A entry", error: error });
  }
};

exports.deleteAllQandA = async (req, res) => {
  try {
      await questionanswer.deleteMany({}); // Delete all documents
      res.status(200).json({ message: "All Q&A entries deleted successfully" });
  } catch (error) {
      console.error("Failed to delete all Q&A entries:", error);
      res.status(500).json({ message: "Failed to delete all Q&A entries", error: error });
  }
};

exports.updateQandA = async (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;

  try {
      const updatedQandA = await questionanswer.findByIdAndUpdate(id, { question, answer }, { new: true });
      if (!updatedQandA) {
          return res.status(404).json({ message: "Q&A entry not found" });
      }
      res.status(200).json({ message: "Q&A entry updated successfully", updatedQandA });
  } catch (error) {
      console.error("Failed to update Q&A entry:", error);
      res.status(500).json({ message: "Failed to update Q&A entry", error: error });
  }
};

exports.botsaveUserDetails=async (req, res) => {
  try {
      // Create a new document using the provided user details
      const newUser = new botuserdetail({
          name: req.body.name,
          email: req.body.email,
          phoneNumber: req.body.phoneNumber
      })

      // Save the new user document to the database
      await newUser.save();

      // Send a success response
      res.status(200).json({ message: 'User details saved successfully' });
  } catch (error) {
      console.error('Error saving user details:', error);
      // Send an error response
      res.status(500).json({ message: 'Failed to save user details' });
  }
};


exports.deletechatuser = async (req, res) => {
  const userId = req.params.id;
  
  try {
      // Find the user by ID and delete it
      const deletedUser = await botuserdetail.findByIdAndDelete(userId);
      
      if (!deletedUser) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Respond with a success message
      res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
      // Handle errors
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
  }
};