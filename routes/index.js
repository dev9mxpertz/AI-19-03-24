var express = require('express');
var router = express.Router();
const Employee = require('../models/employeeModel');
const UserModel = require("../models/userModel");
const jwt = require('jsonwebtoken');
const {sendmail} = require("../utils/mail");
const bcrypt = require("bcrypt");
const sendToken = require('../helper/sendToken');
const tokenBlacklist = require('../models/tokenBlackListModel');
const Notification = require("../models/notificationModel");
const indexController = require("../controllers/indexController")
const notificationController = require("../controllers/notificationController");
const chatController = require("../controllers/chatController");
const employeeController = require("../controllers/employeeController");
const subscriptionController = require("../controllers/subscriptionController");
const getintouchcontroller = require("../controllers/getinTouchController")
const AdminuserController = require("../controllers/AdminuserController")
const companyController = require("../controllers/companyController")
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
//Login Middleware//
const isLoggedIn = (req, res, next) => {
  console.log("Authorization Header:", req.cookies.token);
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication failed. Token missing.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    console.log(decoded);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed. Invalid token.' });
  }
};

const authenticateUser = (req, res, next) => {
  // Extract the token from the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token is required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using the same secret key used to sign the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Add the user's ID (decoded from the token) to the request object
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

router.post("/signup",indexController.signup);

router.post("/login",indexController.login);


router.get("/get_user/:id", async (req, res) => {
    const { id } = req.params; // Extract the ID from the request parameters

    try {
        const user = await UserModel.findById(id); // Find the user by ID

        if (!user) {
            return res.status(404).json({ message: "User not found" }); // If no user is found, return a 404 response
        }
        const userData = {
            id: user._id,
            username: user.username,
            email: user.email,
          
        };

        return res.status(200).json(userData); // Return the user data
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        return res.status(500).json({ message: "An error occurred while fetching the user data" });
    }
});


router.post('/update_user/:id',isLoggedIn, async (req, res) => {
  const userId = req.params.id;
  const { username, email } = req.body;

  try {
      const updates = { username, email };
      const updatedUser = await UserModel.findByIdAndUpdate(userId, updates, { new: true });

      if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

router.post('/delete_user/:id', authenticateUser, async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!(await UserModel.comparePassword(password, user.password))) {
      return res.status(401).json({ message: 'Invalid old password' });
    }

    // If the password is correct, proceed to delete the user
    await UserModel.findByIdAndDelete(id);

    // Optionally, clear up any related data that the user might have created

    res.status(200).json({ message: 'User successfully deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

router.post('/add_employee',  employeeController.addEmployee);
router.get('/get_employee', employeeController.getEmployee);
router.post('/update_employee/:id', employeeController.updateEmployee);
router.post('/delete_employee/:id', employeeController.delete_employee);


router.post("/forgot_password",indexController.forgot_password)

router.post("/change_password",authenticateUser,indexController.change_password)

router.post("/reset_password/verify_otp",indexController.reset_password)

router.post('/logout', async (req, res) => {
  // Check if the Authorization header is provided
  if (!req.headers.authorization) {
      return res.status(401).json({ error: 'No authorization token provided' });
  }

  // Extract the token from the Authorization header
  const tokenParts = req.headers.authorization.split(' ');

  // Check if the Authorization header is correctly formatted as 'Bearer token'
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(400).json({ error: 'Bad authorization header format. Format is "Bearer <token>".' });
  }

  const token = tokenParts[1];

  // Add the token to the blacklist
  try {
      await tokenBlacklist.create({ token });
      res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ error: 'Something went wrong during logout' });
  }
});

router.get("/get_notification/:userId",isLoggedIn,notificationController.getNotifications);

router.post('/create_notification/:userId',isLoggedIn, notificationController.createNotification);

router.delete("/delete_notification/:userId/:notificationId",isLoggedIn,notificationController.deleteNotification);

router.post('/message', chatController.message);

router.post("/subscribe",subscriptionController.subscribe);

router.get("/getsubscriptions",subscriptionController.getSubscriptions)

router.post("/getinTouch",getintouchcontroller.getinTouch);

router.get("/get_userby_admin/:userId",isLoggedIn,AdminuserController.get_userby_admin)

router.post("/add_userby_admin",isLoggedIn,AdminuserController.add_userby_admin);

router.post("/update_userby_admin/:userId",isLoggedIn,AdminuserController.update_userby_admin)

router.post("/delete_userby_admin/:userId",isLoggedIn,AdminuserController.delete_userby_admin)

router.post("/company",companyController.company)

router.get("/get_company",companyController.get_company)

router.post("/update_company",companyController.update_company)

router.patch('/notification/read/:notificationId', notificationController.notificationread);

router.post('/chatbotprofile/:userId', upload.single('Avatar'), chatController.chatprofile);

router.put("/updateChatProfile/:id",chatController.updateChatProfile)

router.get('/getchatprofile/:userId',chatController.getchatprofile);

router.post("/questionanswer",chatController.questionanswer);

router.post("/getanswer",chatController.getanswer)

router.get("/getallQandA",chatController.getAllQandA)

router.post("/updateQandA/:id",chatController.updateQandA)

router.post("/deleteQandA/:id",chatController.deleteQandA)

router.post("/deleteallQandA",chatController.deleteAllQandA)

router.post("/botsaveUserDetails",chatController.botsaveUserDetails)

router.post("/deletechatuser/:id",chatController.deletechatuser)




module.exports = router;
