const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { User } = require('../models');

const signupController = async (req, res) => {
    try {
        const { name, email, password, profile_picture, headline, location, role } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profile_picture,
            headline,
            location,
            role: role === 'admin' ? 'admin' : 'user',
        });

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                headline: user.headline,
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET_KEY || 'default_secret_key',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                headline: user.headline,
                profile_picture: user.profile_picture,
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No user found with this email address'
            });
        }

        // Generate 32-byte hex reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpires = new Date(Date.now() + 3600000); // 1 hour validity

        user.reset_password_token = resetToken;
        user.reset_password_expires = tokenExpires;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset token generated successfully.',
            resetToken, // In production, this can also be dispatched via email
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const resetPasswordController = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Token and new password are required'
            });
        }

        const user = await User.findOne({
            where: {
                reset_password_token: token,
                reset_password_expires: {
                    [Op.gt]: new Date(),
                },
            },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired password reset token'
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.reset_password_token = null;
        user.reset_password_expires = null;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password has been reset successfully. You can now log in.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    signupController,
    loginController,
    forgotPasswordController,
    resetPasswordController,
};
