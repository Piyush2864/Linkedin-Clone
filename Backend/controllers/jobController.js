const { Job } = require('../models/job.js');
const { User } = require('../models/user.js');
const { Application } = require('../models/application.js');



const createJobController = async (req, res) => {
    try {
        const { title, description, company_name, location, employment_type } = req.body;
        const posted_by = req.user.id;

        const job = await Job.create({
            title,
            description,
            company_name,
            location,
            employment_type,
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
            message: 'Server error', error
        });
    }
}


const getAllJobsController = async (req, res) => {
    try {
        const jobs = await Job.findAll({
            include: [{ model: User, as: 'recruiter', attributes: ['id', 'name', 'email'] }],
        });

        res.status(200).json({
            success: true,
            message: 'Fetch all jobs successfully',
            data: jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


module.exports = {
    createJobController,
    getAllJobsController
}