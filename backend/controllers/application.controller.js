import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

const VALID_STATUSES = ["pending", "accepted", "rejected"];

// ─── APPLY FOR JOB (Student) ──────────────────────────────────────────────────
export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required.",
                success: false
            });
        }

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: userId
        });
        if (existingApplication) {
            return res.status(409).json({
                message: "You have already applied for this job.",
                success: false
            });
        }

        // Create application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId
        });

        // Push application reference into the job
        job.applications.push(newApplication._id);
        await job.save();

        return res.status(201).json({
            message: "Application submitted successfully!",
            success: true
        });
    } catch (error) {
        console.error("[applyJob]", error);
        return res.status(500).json({
            message: "Internal server error. Could not submit application.",
            success: false
        });
    }
};

// ─── GET APPLIED JOBS (Student) ───────────────────────────────────────────────
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const application = await Application.find({ applicant: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: "job",
                populate: {
                    path: "company"
                }
            });

        return res.status(200).json({
            application,
            success: true
        });
    } catch (error) {
        console.error("[getAppliedJobs]", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// ─── GET APPLICANTS FOR A JOB (Recruiter) ────────────────────────────────────
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: "applications",
            options: { sort: { createdAt: -1 } },
            populate: {
                path: "applicant"
            }
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        return res.status(200).json({
            job,
            success: true
        });
    } catch (error) {
        console.error("[getApplicants]", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// ─── UPDATE APPLICATION STATUS (Recruiter) ────────────────────────────────────
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!status) {
            return res.status(400).json({
                message: "Status is required.",
                success: false
            });
        }

        const normalizedStatus = status.toLowerCase();
        if (!VALID_STATUSES.includes(normalizedStatus)) {
            return res.status(422).json({
                message: `Status must be one of: ${VALID_STATUSES.join(", ")}.`,
                success: false
            });
        }

        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }

        application.status = normalizedStatus;
        await application.save();

        return res.status(200).json({
            message: `Application status updated to '${normalizedStatus}'.`,
            success: true
        });
    } catch (error) {
        console.error("[updateStatus]", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};