const { Job } = require('../models/job.js');
const { User } = require('../models/user.js');
const { Application } = require('../models/application.js');



const applyForJobController = async (req, res) => {
    try {
        const { resume_url, cover_letter } = req.body;
        const applicant_id = req.user.id;
        const job_id = req.params.jobId;

        const application = await Application.create({
            job_id,
            applicant_id,
            resume_url,
            cover_letter,
        });

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


const getAllApplicationController = async (req, res) => {
    try {
        const job_id = req.params.jobId;
        const job = await Job.findByPk(job_id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }


        if (job.posted_by !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to view applications'
            });
        }

        const applications = await Application.findAll({
            where: { job_id },
            include: [{ model: User, as: 'applicant', attributes: ['id', 'name', 'email'] }],
        });

        res.status(200).json({
            success: true,
            message: 'Fetch all job application successfully.',
            data: applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


const updateApplicationStatusController = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.applicationId;

        const application = await Application.findByPk(applicationId, {
            include: [{ model: Job, as: 'job' }],
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }


        if (application.job.posted_by !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to update application'
            });
        }

        application.status = status;
        await application.save();

        res.status(200).json({
            success: true,
            message: 'Application status updated',
            data: application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


module.exports = {
    applyForJobController,
    getAllApplicationController,
    updateApplicationStatusController
}