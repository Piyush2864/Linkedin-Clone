const { User } = require('../models/user.js');



const upgradeToPremiumController = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        user.subscription_type = 'premium';
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Subscription upgraded to Premium',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


const getSubscriptionStatusController = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        res.status(200).json({
            success: true,
            subscription_type: user.subscription_type
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


module.exports = {
    upgradeToPremiumController,
    getSubscriptionStatusController,
}