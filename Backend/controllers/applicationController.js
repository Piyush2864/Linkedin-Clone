const { Job, User, Application, Company } = require('../models');
const { sendNotification } = require('../utils/notification.js');

const applyForJobController = async (req, res) => {
    try {
        const { resume_url, cover_letter } = req.body;
        const applicant_id = req.user.id;
        const job_id = req.params.jobId;

        const job = await Job.findByPk(job_id);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        const existingApplication = await Application.findOne({
            where: { job_id, applicant_id },
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied for this job.'
            });
        }

        const application = await Application.create({
            job_id,
            applicant_id,
            resume_url: req.file ? `/uploads/${req.file.filename}` : resume_url,
            cover_letter,
            status: 'pending',
        });

        // Notify the recruiter
        sendNotification(
            job.posted_by,
            applicant_id,
            'job_application',
            `New application received for "${job.title}"`
        );

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

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

        if (job.posted_by !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to view applications'
            });
        }

        const applications = await Application.findAll({
            where: { job_id },
            include: [{ model: User, as: 'applicant', attributes: ['id', 'name', 'email', 'profile_picture', 'headline'] }],
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({
            success: true,
            message: 'Fetch all job applications successfully.',
            data: applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const getMyApplicationsController = async (req, res) => {
    try {
        const applicant_id = req.user.id;

        const applications = await Application.findAll({
            where: { applicant_id },
            include: [
                {
                    model: Job,
                    as: 'job',
                    include: [
                        { model: Company, as: 'company', attributes: ['id', 'name', 'logo'] },
                        { model: User, as: 'recruiter', attributes: ['id', 'name', 'email'] },
                    ],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({
            success: true,
            message: 'Fetch my applications successfully.',
            applications,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

const updateApplicationStatusController = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.applicationId;

        const validStatuses = ['pending', 'reviewed', 'shortlisted', 'interviewing', 'accepted', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
            });
        }

        const application = await Application.findByPk(applicationId, {
            include: [{ model: Job, as: 'job' }],
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        if (application.job.posted_by !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to update application'
            });
        }

        application.status = status;
        await application.save();

        // Notify candidate of status update
        sendNotification(
            application.applicant_id,
            req.user.id,
            'application_status_update',
            `Your application for "${application.job.title}" status has been updated to "${status}"`
        );

        if (global.io) {
            global.io.emit(`application_update_${application.applicant_id}`, {
                applicationId: application.id,
                status,
                jobTitle: application.job.title,
            });
        }

        res.status(200).json({
            success: true,
            message: 'Application status updated',
            data: application
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
    applyForJobController,
    getAllApplicationController,
    getMyApplicationsController,
    updateApplicationStatusController,
};