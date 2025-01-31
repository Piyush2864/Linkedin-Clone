const { Profile } = require('../models/profile.js');



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
        const { bio, skills, experience, education } = req.body;
        const userId = req.user.id;


        let profile = await Profile.findOne({ where: { user_id: userId } });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found',
            });
        }


        profile = await profile.update({
            bio,
            skills,
            experience,
            education,
        });

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
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


const deleteProfileController = async (req, res) => {
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

        // Delete profile
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

module.exports = {
    createProfileController,
    getProfileController,
    updateProfileController,
    deleteProfileController
}