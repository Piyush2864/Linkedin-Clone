const { ProfileView } = require('../models/profileView.js');
const Notification = require('../models/notification.js');
const { User } = require('../models/user.js');


const onlineUsers = new Map(); 

const trackProfileViewController = async (req, res) => {
    try {
        const viewerId = req.user.id;
        const viewedUserId = req.params.userId;

        if (viewerId === parseInt(viewedUserId)) {
            return res.status(400).json({
                success: false,
                message: "You can't view your own profile"
            });
        }

        
        await ProfileView.create({ viewer_id: viewerId, viewed_user_id: viewedUserId });

        
        const notification = await Notification.create({
            user_id: viewedUserId,
            sender_id: viewerId,
            type: 'profile_view',
            message: `${req.user.name} viewed your profile.`,
        });

        
        const receiverSocket = activeUsers.get(viewedUserId);
        if (receiverSocket) {
            io.to(receiverSocket).emit('newNotification', {
                type: 'profile_view',
                message: `${req.user.name} viewed your profile.`,
            });
        }

        res.status(201).json({
            success: true,
            message: 'Profile view recorded and notification sent'
        });

    } catch (error) {
        console.error("Error in trackProfileViewController:", error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};


const getAllProfileViewController = async (req, res) => {
    try {
        const userId = req.user.id;


        const user = await User.findByPk(userId);
        if (user.subscription_type !== 'premium') {
            return res.status(403).json({
                success: false,
                message: 'Upgrade to Premium to access this feature',
            });
        }

        const profileViews = await ProfileView.findAll({
            where: { viewed_user_id: userId },
            include: [{ model: User, as: 'viewer', attributes: ['id', 'name'] }],
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({
            success: true,
            message: 'Fetch all profile views.',
            profileViews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error
        });
    }
};



const profileViewAnalyticsController = async (req, res) => {
    try {
        const userId = req.user.id;


        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);


        const weeklyViews = await ProfileView.count({
            where: {
                viewed_user_id: userId,
                createdAt: { [Op.gte]: sevenDaysAgo },
            },
        });


        const monthlyViews = await ProfileView.count({
            where: {
                viewed_user_id: userId,
                createdAt: { [Op.gte]: thirtyDaysAgo },
            },
        });

        res.status(200).json({
            success: true,
            message: 'Fetch view profile analytic data.',
            weeklyViews,
            monthlyViews,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


module.exports = {
    trackProfileViewController,
    getAllProfileViewController,
    profileViewAnalyticsController,
}