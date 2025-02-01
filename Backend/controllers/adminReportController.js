const { User } = require('../../models/user.js');
const { Job } = require('../models/job.js');
const { Post } = require('../models/post.js');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const fs = require('fs');



const generateCsvReportController = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: ['id', 'name', 'email', 'subscription_type'] });

        const parser = new Parser();
        const csv = parser.parse(users);

        res.header('Content-Type', 'text/csv');
        res.attachment('users.csv');
        res.send({
            success: true,
            csv
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


const generatePdfReportController = async (req, res) => {
    try {
        const jobs = await Job.findAll({ attributes: ['id', 'title', 'company', 'location'] });

        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=jobs.pdf');
        doc.pipe(res);

        doc.fontSize(16).text('Job Report', { align: 'center' });

        jobs.forEach((job, index) => {
            doc.fontSize(12).text(`${index + 1}. ${job.title} at ${job.company}, ${job.location}`);
        });

        doc.end();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error', error
        });
    }
}


module.exports = {
    generateCsvReportController,
    generatePdfReportController,
}