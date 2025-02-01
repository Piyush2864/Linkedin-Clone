const { Job } = require('../models/job.js');
const { User } = require('../models/user.js');
const { Application } = require('../models/application.js');



const recommenedJobController = async (req, res) => {
    try {
        const userId = req.user.id;


        const user = await User.findByPk(userId, { attributes: ['skills', 'location'] });

        if (!user || !user.skills) {
            return res.status(400).json({
                success: false,
                message: 'User profile incomplete'
            });
        }

        const userSkills = user.skills.split(',').map(skill => skill.trim().toLowerCase());
        const userLocation = user.location ? user.location.toLowerCase() : null;


        const skillMatchedJobs = await Job.findAll({
            where: {
                [Op.or]: userSkills.map(skill => ({
                    description: { [Op.like]: `%${skill}%` },
                })),
            },
        });


        const pastApplications = await Application.findAll({ where: { applicant_id: userId } });
        const appliedJobTitles = pastApplications.map(app => app.job_title.toLowerCase());

        const relatedJobs = await Job.findAll({
            where: {
                title: {
                    [Op.or]: appliedJobTitles.map(title => ({
                        [Op.like]: `%${title}%`,
                    })),
                },
            },
        });


        const locationMatchedJobs = userLocation
            ? await Job.findAll({
                where: {
                    location: { [Op.like]: `%${userLocation}%` },
                },
            })
            : [];


        const recommendedJobs = [...new Set([...skillMatchedJobs, ...relatedJobs, ...locationMatchedJobs])];

        res.status(200).json({
            success: true,
            message: 'Fetch all recommened jobs successfully.',
            data: recommendedJobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


module.exports = {
    recommenedJobController
}