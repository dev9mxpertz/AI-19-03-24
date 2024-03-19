const Adminuser = require("../models/AdminuserModel");


exports.add_userby_admin = async (req,res)=>{
    const {name,email,password,userRole} = req.body;

    if (!req.user || req.user.role !== 'admin' ) {
        return res.status(403).json({message:"only admin is allowed to add user"});
    }
    try {
        const newUser = new Adminuser({
            name,
            email,
            password,
            userRole
        });
        await newUser.save();
        res.status(201).json({message:"user added succesfully",newUser})
        
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

exports.get_userby_admin = async (req,res) =>{
   
    const {userId} = req.params;

    if (!req.user || req.user.role !== "admin") {
       return res.status(403).json({message:"only admins are allowed to have access to user data"})
    }
    try {
        const user = await Adminuser.findById(userId);

        if (!user) {
            res.status(404).json({message:"user not found"})
        }
        const userData = {
            id:user._id,
            name:user.name,
            email:user.email,
            password:user.password,
            userRole:user.userRole
        };
        res.status(200).json({userData})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"error getting user details"})
    }
}

exports.update_userby_admin = async (req, res) => {
    const { userId } = req.params;
    const { name, email, password, userRole } = req.body;

    // Early return if not admin
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Only admins are allowed to update" });
    }

    try {
        // Log for debugging - consider removing for production
        console.log("Updating user ID:", userId);

        const updates = {
            ...(name && { name }),
            ...(email && { email }),
            ...(password && {password}),
            ...(userRole && { userRole }),
        };

        const updatedUser = await Adminuser.findByIdAndUpdate(userId, updates, { new: true });
        
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

exports.delete_userby_admin = async (req,res)=>{

    const {userId} = req.params;
    if (!req.user || req.user.role !== "admin") {
        res.status(403).json({message:"only admin is allowed to delete user"})
    }
    try {
        const user = await Adminuser.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
        res.status(200).json({message:"user deleted successfully"})
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Error deleting user",error:error.message})

}}