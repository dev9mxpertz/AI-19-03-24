const subscription = require("../models/subscriptionModel");


exports.subscribe = async (req,res)=>{
    const {email} = req.body;
    if (!email){
        return res.status(400).json({error:"Email is required"})
    }

    try {
        const newSubscription = new subscription({email});
        await newSubscription.save();
        res.json({message:"subscription successful"});
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email is already subscribed' });
        }
        console.error(error);
        res.status(500).json({ error: 'An error occurred while subscribing' });
    }
}

exports.getSubscriptions = async (req, res) => {
    try {
        const subscriptions = await subscription.find(); // Assuming 'subscription' is your Mongoose model
        res.json(subscriptions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching subscriptions' });
    }
};




