const UserModel = require("../models/userModel")
const sendToken = require('../helper/sendToken');
const {sendmail} = require("../utils/mail");



exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user || !(await UserModel.comparePassword(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token for successful login
        const token = await user.jwttoken();

        // Respond with both token and userId
        res.status(200).json({ token, userId: user._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.signup = (req, res) => {
  console.log(req.body);
  const { username, email, password, confirmPassword } = req.body;

  // Check if password and confirmPassword match
  if (password !== confirmPassword) {
      return res.status(400).send({ code: 400, message: "Passwords do not match" });
  }

  // Determine role based on email domain
  let role = 'user'; // Default role
  const domain = email.split('@')[1];

  if (domain === 'admin.com') {
      role = 'admin';
  } else if (domain === 'manager.com') {
      role = 'manager';
  } else if (domain === 'employee.com') {
      role = 'employee';
  }

  const newUser = new UserModel({ username, password, email, role });

  newUser.save()
      .then(success => {
          console.log(success);
          sendToken(newUser, res, 201); // Assuming sendToken handles token creation and sending response
      })
      .catch(err => {
          console.error(err);
          if (err && err.code === 11000) {
              res.status(400).send({ code: 400, message: "User already exists" });
          } else {
              res.status(500).send({ code: 500, message: "Error saving user" });
          }
      });
};
  
  exports.forgot_password = ( async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }
  
    try {
      const user = await UserModel.findOne({ email: email.trim().toLowerCase() });
  
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      await user.save();
  
      try {
        await sendmail(req, user);
        res.status(200).json({ message: "Password reset instructions sent to your email." });
      } catch (sendMailError) {
        console.error("Send mail error:", sendMailError);
        res.status(500).json({ message: "An error occurred while sending the email." });
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "An error occurred while processing your request." });
    }
  });
  
  exports.change_password = ( async (req, res) => {
    const { oldPassword, newPassword } = req.body;
  
    try {
      // Find the user by ID
      const user = await UserModel.findById(req.user.id);
  
      // Validate the old password
      if (!user || !(await UserModel.comparePassword(oldPassword, user.password))) {
        return res.status(401).json({ message: 'Invalid old password' });
      }
  
      user.password = newPassword;
  
      // Save the user
      await user.save();
  
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  exports.reset_password=( async (req, res) => {
    const { otp, newPassword } = req.body;
  
    try {
        // Find user by OTP
        const user = await UserModel.findOne({ otp });
  
        // Check if OTP has expired
        if (!user || !user.otpExpires || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP is invalid or has expired.' });
        }
  
        if (!user) {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }
         user.password = newPassword;
        user.otp = undefined; // Remove OTP
        user.otpExpires = undefined; // Remove OTP expiration date
        await user.save();
  
        res.status(200).json({ message: 'Password successfully reset.' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
  });
  
  
  
  