const { ProfileView } = require('../models/profileView.js');



const trackProfileViewController = async (req, res) => {
    try {
        const viewerId = req.user.id;
        const viewedUserId = req.params.userId;

        if (viewerId === parseInt(viewedUserId)) {
            return res.status(400).json({
                success: false,
                message: 'You cannot view your own profile'
            });
        }


        await ProfileView.create({ viewer_id: viewerId, viewed_user_id: viewedUserId });


        await Notification.create({
            user_id: viewedUserId,
            type: 'profile_view',
            message: `User ${viewerId} viewed your profile.`,
        });

        res.status(201).json({
            success: true,
            message: 'Profile view recorded'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


const getAllProfileViewController = async (req, res) => {
    try {
        const userId = req.user.id;

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
            message: 'Server error', error
        });
    }
}


module.exports = {
    trackProfileViewController,
    getAllProfileViewController,
}