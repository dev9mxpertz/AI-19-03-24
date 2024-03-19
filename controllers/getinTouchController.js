const getintouch = require("../models/getinTouchModel")


exports.getinTouch = async (req, res) => {
    const { name, mobile, email, subject, message } = req.body;
    if (!name || !mobile || !email || !subject || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const newSubmission = new getintouch ({ name, mobile, email, subject, message });
        await newSubmission.save();
        return res.json({ message: "Submission successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while submitting the form" });
    }
};




  