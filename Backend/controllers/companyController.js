const { Company, CompanyFollower, Job, User } = require('../models');
const { Op } = require('sequelize');

const createCompanyController = async (req, res) => {
    try {
        const { name, description, industry, company_size, website, location } = req.body;
        const owner_id = req.user.id;

        const logo = req.files && req.files.logo ? `/uploads/${req.files.logo[0].filename}` : null;
        const cover_image = req.files && req.files.cover_image ? `/uploads/${req.files.cover_image[0].filename}` : null;

        const company = await Company.create({
            name,
            description,
            industry,
            company_size,
            website,
            logo,
            cover_image,
            location,
            owner_id,
        });

        res.status(201).json({
            success: true,
            message: 'Company page created successfully',
            company,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

const getAllCompaniesController = async (req, res) => {
    try {
        const search = req.query.search || '';
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        const whereCondition = search
            ? { name: { [Op.like]: `%${search}%` } }
            : {};

        const { count, rows: companies } = await Company.findAndCountAll({
            where: whereCondition,
            include: [
                { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset,
        });

        res.status(200).json({
            success: true,
            message: 'Fetch companies successfully',
            companies,
            pagination: {
                totalCompanies: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                limit,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

const getCompanyByIdController = async (req, res) => {
    try {
        const companyId = req.params.companyId;

        const company = await Company.findByPk(companyId, {
            include: [
                { model: User, as: 'owner', attributes: ['id', 'name', 'email', 'profile_picture'] },
                { model: Job, as: 'jobs' },
            ],
        });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found',
            });
        }

        const followersCount = await CompanyFollower.count({ where: { company_id: companyId } });

        res.status(200).json({
            success: true,
            company,
            followersCount,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

const updateCompanyController = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        const userId = req.user.id;
        const { name, description, industry, company_size, website, location } = req.body;

        const company = await Company.findByPk(companyId);
        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found',
            });
        }

        if (company.owner_id !== userId && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to update this company profile',
            });
        }

        if (name) company.name = name;
        if (description) company.description = description;
        if (industry) company.industry = industry;
        if (company_size) company.company_size = company_size;
        if (website) company.website = website;
        if (location) company.location = location;

        if (req.files) {
            if (req.files.logo) {
                company.logo = `/uploads/${req.files.logo[0].filename}`;
            }
            if (req.files.cover_image) {
                company.cover_image = `/uploads/${req.files.cover_image[0].filename}`;
            }
        }

        await company.save();

        res.status(200).json({
            success: true,
            message: 'Company updated successfully',
            company,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

const followCompanyController = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        const userId = req.user.id;

        const company = await Company.findByPk(companyId);
        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found',
            });
        }

        const existingFollow = await CompanyFollower.findOne({
            where: { company_id: companyId, user_id: userId },
        });

        if (existingFollow) {
            return res.status(400).json({
                success: false,
                message: 'You are already following this company',
            });
        }

        await CompanyFollower.create({
            company_id: companyId,
            user_id: userId,
        });

        res.status(200).json({
            success: true,
            message: 'Followed company successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

const unfollowCompanyController = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        const userId = req.user.id;

        const followEntry = await CompanyFollower.findOne({
            where: { company_id: companyId, user_id: userId },
        });

        if (!followEntry) {
            return res.status(404).json({
                success: false,
                message: 'You are not following this company',
            });
        }

        await followEntry.destroy();

        res.status(200).json({
            success: true,
            message: 'Unfollowed company successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

const getCompanyJobsController = async (req, res) => {
    try {
        const companyId = req.params.companyId;

        const jobs = await Job.findAll({
            where: { company_id: companyId },
            include: [{ model: User, as: 'recruiter', attributes: ['id', 'name', 'email'] }],
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({
            success: true,
            message: 'Fetch company jobs successfully',
            jobs,
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
    createCompanyController,
    getAllCompaniesController,
    getCompanyByIdController,
    updateCompanyController,
    followCompanyController,
    unfollowCompanyController,
    getCompanyJobsController,
};
