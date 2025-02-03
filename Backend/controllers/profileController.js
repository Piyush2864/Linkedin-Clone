const { Profile } = require('../models/profile.js');
const { Notification } = require('../models/notification.js');
const { User } = require('../models/user.js');



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
            error,
        });
    }
};


const getProfileController = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find profile
        const profile = await Profile.findOne({ where: { user_id: userId } });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


const updateProfileController = async (req, res) => {
    try {
        const { bio, skills, experience, education, headline } = req.body;
        const userId = req.user.id;

        // Fetch profile details
        let profile = await Profile.findOne({ where: { user_id: userId } });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found',
            });
        }

        // Fetch user details for profile & image updates
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Update profile data
        profile = await profile.update({
            bio: bio || profile.bio,
            skills: skills || profile.skills,
            experience: experience || profile.experience,
            education: education || profile.education,
        });

        // Update user headline
        user.headline = headline || user.headline;

        // Handle profile and cover photo uploads
        if (req.files) {
            if (req.files.coverPhoto) {
                user.coverPhoto = `/uploads/${req.files.coverPhoto[0].filename}`;
            }
            if (req.files.profilePicture) {
                user.profilePicture = `/uploads/${req.files.profilePicture[0].filename}`;
            }
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            profile,
            user,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error,
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
            message: 'Server error', error
        });
    }
}


const searchSkills = async (req, res) => {
    const { searchTerm } = req.query;

    try {
        const skills = await Skill.find({
            name: { $regex: searchTerm, $options: 'i' },  // Case-insensitive search
        });

        res.status(200).json({ skills });
    } catch (error) {
        res.status(500).json({ message: 'Error searching skills.' });
    }
};


const addEndorsementController = async (req, res) => {
    const { userId, skill } = req.body;
    const endorsingUserId = req.user.id;

    try {

        const userToBeEndorsed = await User.findById(userId);
        if (!userToBeEndorsed) {
            return res.status(404).json({ message: 'User not found' });
        }


        if (!userToBeEndorsed.skills.includes(skill)) {
            userToBeEndorsed.skills.push(skill);
        }

        await userToBeEndorsed.save();

        // Create the notification
        const notificationMessage = `${req.user.name} has endorsed you for ${skill}`;
        const notification = new Notification({
            userId: userToBeEndorsed._id,
            type: 'endorsement',
            message: notificationMessage,
        });
        await notification.save();

        res.status(200).json({ message: 'Endorsement added and notification sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding endorsement and notification' });
    }
};



const removeEndorsementController = async (req, res) => {
    const { userId, skill } = req.body;
    const endorsingUserId = req.user.id;

    try {

        const userToBeEndorsed = await User.findById(userId);
        if (!userToBeEndorsed) {
            return res.status(404).json({ message: 'User not found' });
        }


        userToBeEndorsed.skills = userToBeEndorsed.skills.filter((s) => s !== skill);

        await userToBeEndorsed.save();


        const notificationMessage = `${req.user.name} removed the endorsement for ${skill}`;
        const notification = new Notification({
            userId: userToBeEndorsed._id,
            type: 'endorsement',
            message: notificationMessage,
        });
        await notification.save();

        res.status(200).json({ message: 'Endorsement removed and notification sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error removing endorsement and notification' });
    }
};



module.exports = {
    createProfileController,
    getProfileController,
    updateProfileController,
    deleteProfileController,
    searchSkills,
    addEndorsementController,
    removeEndorsementController,
}