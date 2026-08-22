const { Job, User, Company, Application, SavedJob } = require('../models');
const { Op } = require('sequelize');

const createJobController = async (req, res) => {
    try {
        const { title, description, company_name, company_id, location, employment_type, salary_range, experience_level } = req.body;
        const posted_by = req.user.id;

        const job = await Job.create({
            title,
            description,
            company_name,
            company_id: company_id || null,
            location,
            employment_type: employment_type || 'Full-time',
            salary_range,
            experience_level,
            posted_by,
        });

        res.status(201).json({
            success: true,
            message: 'Job posted successfully',
            data: job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const getAllJobsController = async (req, res) => {
    try {
        const { keyword, location, employment_type, company_id } = req.query;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        const whereCondition = {};

        if (keyword) {
            whereCondition[Op.or] = [
                { title: { [Op.like]: `%${keyword}%` } },
                { description: { [Op.like]: `%${keyword}%` } },
                { company_name: { [Op.like]: `%${keyword}%` } },
            ];
        }

        if (location) {
            whereCondition.location = { [Op.like]: `%${location}%` };
        }

        if (employment_type) {
            whereCondition.employment_type = employment_type;
        }

        if (company_id) {
            whereCondition.company_id = company_id;
        }

        const { count, rows: jobs } = await Job.findAndCountAll({
            where: whereCondition,
            include: [
                { model: User, as: 'recruiter', attributes: ['id', 'name', 'email', 'profile_picture'] },
                { model: Company, as: 'company', attributes: ['id', 'name', 'logo', 'location'] },
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset,
        });

        res.status(200).json({
            success: true,
            message: 'Fetch jobs successfully',
            jobs,
            pagination: {
                totalJobs: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                limit,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const getJobByIdController = async (req, res) => {
    try {
        const jobId = req.params.jobId;

        const job = await Job.findByPk(jobId, {
            include: [
                { model: User, as: 'recruiter', attributes: ['id', 'name', 'email', 'profile_picture', 'headline'] },
                { model: Company, as: 'company' },
            ],
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        res.status(200).json({
            success: true,
            job,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

const deleteJobController = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const userId = req.user.id;

        const job = await Job.findByPk(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        if (job.posted_by !== userId && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to delete this job posting',
            });
        }

        await job.destroy();

        res.status(200).json({
            success: true,
            message: 'Job posting deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

module.exports = {
    createJobController,
    getAllJobsController,
    getJobByIdController,
    deleteJobController,
};