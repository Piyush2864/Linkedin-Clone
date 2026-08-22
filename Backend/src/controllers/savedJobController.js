const { SavedJob } = require('../models/savedJob.js');
const { Job } = require('../models/job.js');



const savedJobController = async (req, res) => {
    try {
        const userId = req.user.id;
        const jobId = req.params.jobId;


        const existingSave = await SavedJob.findOne({ where: { user_id: userId, job_id: jobId } });
        if (existingSave) {
            return res.status(400).json({
                success: false,
                message: 'Job already saved'
            });
        }

        const jobs = await SavedJob.create({ user_id: userId, job_id: jobId });

        res.status(201).json({
            success: true,
            message: 'Job saved successfully',
            data: jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


const getAllSavedJobController = async (req, res) => {
    try {
        const userId = req.user.id;

        const savedJobs = await SavedJob.findAll({
            where: { user_id: userId },
            include: [{ model: Job }],
        });

        res.status(200).json({
            success: true,
            message: 'Fetch all saved jobs successfully.',
            data: savedJobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


const removeSavedJobController = async (req, res) => {
    try {
        const userId = req.user.id;
        const jobId = req.params.jobId;

        await SavedJob.destroy({ where: { user_id: userId, job_id: jobId } });

        res.status(200).json({
            success: true,
            message: 'Job removed from saved jobs'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


module.exports = {
    savedJobController,
    getAllSavedJobController,
    removeSavedJobController,
}