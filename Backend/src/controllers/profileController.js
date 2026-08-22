const { Profile, User, Notification, Endorsement } = require('../models');
const { sendNotification } = require('../utils/notification.js');

const createProfileController = async (req, res) => {
    try {
        const { bio, skills, experience, education } = req.body;
        const userId = req.user.id;

        const existingProfile = await Profile.findOne({ where: { user_id: userId } });
        if (existingProfile) {
            return res.status(400).json({
                success: false,
                message: 'Profile already exists'
            });
        }

        const profile = await Profile.create({
            bio,
            skills,
            experience,
            education,
            user_id: userId,
        });

        return res.status(201).json({
            success: true,
            message: 'Profile created successfully',
            profile,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

const getProfileController = async (req, res) => {
    try {
        const userId = req.user.id;

        const profile = await Profile.findOne({
            where: { user_id: userId },
            include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'headline', 'location', 'profile_picture', 'coverPhoto'] }]
        });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        res.status(200).json({
            success: true,
            profile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const updateProfileController = async (req, res) => {
    try {
        const { bio, skills, experience, education, headline, location } = req.body;
        const userId = req.user.id;

        let profile = await Profile.findOne({ where: { user_id: userId } });
        if (!profile) {
            profile = await Profile.create({ user_id: userId, bio: '', skills: [], experience: [], education: [] });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        profile = await profile.update({
            bio: bio !== undefined ? bio : profile.bio,
            skills: skills !== undefined ? skills : profile.skills,
            experience: experience !== undefined ? experience : profile.experience,
            education: education !== undefined ? education : profile.education,
        });

        user.headline = headline || user.headline;
        user.location = location || user.location;

        if (req.files) {
            if (req.files.coverPhoto) {
                user.coverPhoto = `/uploads/${req.files.coverPhoto[0].filename}`;
            }
            if (req.files.profilePicture) {
                user.profile_picture = `/uploads/${req.files.profilePicture[0].filename}`;
            }
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            profile,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                headline: user.headline,
                location: user.location,
                profile_picture: user.profile_picture,
                coverPhoto: user.coverPhoto,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

const deleteProfileController = async (req, res) => {
    try {
        const userId = req.user.id;

        const profile = await Profile.findOne({ where: { user_id: userId } });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        await profile.destroy();

        res.status(200).json({
            success: true,
            message: 'Profile deleted'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const addEndorsementController = async (req, res) => {
    const { userId, skill } = req.body;
    const endorsingUserId = req.user.id;

    try {
        const userToBeEndorsed = await User.findByPk(userId);
        if (!userToBeEndorsed) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (Endorsement) {
            await Endorsement.create({
                endorsed_by: endorsingUserId,
                endorsed_user: userId,
                skill,
            });
        }

        sendNotification(userId, endorsingUserId, 'endorsement', `Someone endorsed you for ${skill}`);

        res.status(200).json({ success: true, message: 'Endorsement added and notification sent' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding endorsement', error: error.message });
    }
};

const removeEndorsementController = async (req, res) => {
    const { userId, skill } = req.body;
    const endorsingUserId = req.user.id;

    try {
        if (Endorsement) {
            await Endorsement.destroy({
                where: {
                    endorsed_by: endorsingUserId,
                    endorsed_user: userId,
                    skill,
                },
            });
        }

        res.status(200).json({ success: true, message: 'Endorsement removed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error removing endorsement', error: error.message });
    }
};

module.exports = {
    createProfileController,
    getProfileController,
    updateProfileController,
    deleteProfileController,
    addEndorsementController,
    removeEndorsementController,
};