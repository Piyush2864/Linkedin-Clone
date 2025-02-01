const { Endorsement } = require('../models/endoresment.js');



const createEndoresmentController = async (req, res) => {
    try {
        const { endorsed_user, skill } = req.body;
        const endorsed_by = req.user.id;


        const existingEndorsement = await Endorsement.findOne({
            where: { endorsed_by, endorsed_user, skill },
        });
        if (existingEndorsement) {
            return res.status(400).json({
                success: false,
                message: 'Skill already endorsed'
            });
        }

        const endorsement = await Endorsement.create({
            endorsed_by,
            endorsed_user,
            skill,
        });

        res.status(201).json({
            success: true,
            message: 'Skill endorsed successfully',
            data: endorsement
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


const getAllEndoresmentController = async (req, res) => {
    try {
        const endorsements = await Endorsement.findAll({
            where: { endorsed_user: req.params.userId },
        });

        res.status(200).json({
            success: true,
            message: 'Fetch all users endoresments.',
            data: endorsements
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


module.exports = {
    createEndoresmentController,
    getAllEndoresmentController,
}