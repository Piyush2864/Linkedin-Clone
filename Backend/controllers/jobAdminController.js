const { Job } = require('../models/job.js');



const getAllJobsController = async (req, res) => {
    try {
        const jobs = await Job.findAll();
        res.status(200).json({
            success: true,
            message: 'Fetch all jobs successfully.',
            data: jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


const approveJobPostController = async (req, res) => {
    try {
        const jobId = req.params.jobId;


        const admin = await User.findByPk(req.user.id);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admins can approve jobs'
            });
        }

        const job = await Job.findByPk(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job posting not found'
            });
        }

        job.status = 'approved';
        await job.save();

        res.status(200).json({
            success: true,
            message: 'Job approved successfully',
            data: job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


const rejectJobPostController = async (req, res) => {
    try {
        const jobId = req.params.jobId;


        const admin = await User.findByPk(req.user.id);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admins can reject jobs'
            });
        }

        const job = await Job.findByPk(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job posting not found'
            });
        }

        job.status = 'rejected';
        await job.save();

        res.status(200).json({
            success: true,
            message: 'Job rejected successfully',
            data: job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


const deleteJobPostController = async (req, res) => {
    try {
        const jobId = req.params.jobId;


        const admin = await User.findByPk(req.user.id);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admins can delete jobs'
            });
        }

        const job = await Job.findByPk(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job posting not found'
            });
        }

        await job.destroy();
        res.status(200).json({
            success: true,
            message: 'Job deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


module.exports = {
    getAllJobsController,
    approveJobPostController,
    rejectJobPostController,
    deleteJobPostController,
}   