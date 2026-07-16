import { Job } from "../models/job.model.js";

const VALID_JOB_TYPES = ["Full-Time", "Part-Time", "Internship", "Contract", "Remote"];

// ─── POST JOB (Recruiter) ─────────────────────────────────────────────────────
export const postJob = async (req, res) => {
    try {
        const {
            title, description, requirements,
            salary, location, jobType, experience,
            position, companyId
        } = req.body;

        const userId = req.id;

        // Required fields
        if (!title || !description || !requirements || salary === undefined ||
            !location || !jobType || experience === undefined || !position || !companyId) {
            return res.status(400).json({
                message: "All fields are required: title, description, requirements, salary, location, jobType, experience, position, companyId.",
                success: false
            });
        }

        // Title
        if (title.trim().length < 3 || title.trim().length > 100) {
            return res.status(422).json({
                message: "Job title must be between 3 and 100 characters.",
                success: false
            });
        }

        // Salary must be a non-negative number
        const parsedSalary = Number(salary);
        if (isNaN(parsedSalary) || parsedSalary < 0) {
            return res.status(422).json({
                message: "Salary must be a non-negative number.",
                success: false
            });
        }

        // Position (number of openings) must be ≥ 1
        const parsedPosition = Number(position);
        if (!Number.isInteger(parsedPosition) || parsedPosition < 1) {
            return res.status(422).json({
                message: "Number of positions must be a positive integer (≥ 1).",
                success: false
            });
        }

        // Experience must be ≥ 0
        const parsedExperience = Number(experience);
        if (isNaN(parsedExperience) || parsedExperience < 0) {
            return res.status(422).json({
                message: "Experience level must be a non-negative number (years).",
                success: false
            });
        }

        // Job type
        if (!VALID_JOB_TYPES.includes(jobType)) {
            return res.status(422).json({
                message: `Job type must be one of: ${VALID_JOB_TYPES.join(", ")}.`,
                success: false
            });
        }

        // Build requirements array from comma-separated string or existing array
        const requirementsArray = Array.isArray(requirements)
            ? requirements.map(r => r.trim()).filter(Boolean)
            : requirements.split(",").map(r => r.trim()).filter(Boolean);

        const job = await Job.create({
            title: title.trim(),
            description: description.trim(),
            requirements: requirementsArray,
            salary: parsedSalary,
            location: location.trim(),
            jobType,
            experienceLevel: parsedExperience,
            position: parsedPosition,
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            message: "Job posted successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.error("[postJob]", error);
        return res.status(500).json({
            message: "Internal server error. Could not post job.",
            success: false
        });
    }
};

// ─── GET ALL JOBS (Students) – with search, filter, sort, pagination ──────────
export const getAllJobs = async (req, res) => {
    try {
        const {
            keyword = "",
            location: loc,
            jobType,
            minSalary,
            maxSalary,
            experience,
            sort = "newest",
            page = 1,
            limit = 12
        } = req.query;

        // Build query
        const query = {};

        // Text search
        if (keyword.trim()) {
            query.$or = [
                { title: { $regex: keyword.trim(), $options: "i" } },
                { description: { $regex: keyword.trim(), $options: "i" } },
                { requirements: { $regex: keyword.trim(), $options: "i" } }
            ];
        }

        // Location filter
        if (loc && loc !== "all") {
            query.location = { $regex: loc, $options: "i" };
        }

        // Job type filter
        if (jobType && jobType !== "all") {
            query.jobType = jobType;
        }

        // Salary range
        if (minSalary !== undefined || maxSalary !== undefined) {
            query.salary = {};
            if (minSalary !== undefined) query.salary.$gte = Number(minSalary);
            if (maxSalary !== undefined) query.salary.$lte = Number(maxSalary);
        }

        // Experience filter
        if (experience !== undefined && experience !== "all") {
            query.experienceLevel = { $lte: Number(experience) };
        }

        // Sort order
        const sortMap = {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            salary_high: { salary: -1 },
            salary_low: { salary: 1 }
        };
        const sortOrder = sortMap[sort] || { createdAt: -1 };

        // Pagination
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;

        const [jobs, total] = await Promise.all([
            Job.find(query)
                .populate({ path: "company" })
                .sort(sortOrder)
                .skip(skip)
                .limit(limitNum),
            Job.countDocuments(query)
        ]);

        return res.status(200).json({
            jobs,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            },
            success: true
        });
    } catch (error) {
        console.error("[getAllJobs]", error);
        return res.status(500).json({
            message: "Internal server error. Could not fetch jobs.",
            success: false
        });
    }
};

// ─── GET JOB BY ID (Students) ─────────────────────────────────────────────────
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId)
            .populate({ path: "company" })
            .populate({ path: "applications" });

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.error("[getJobById]", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// ─── GET ADMIN JOBS (Recruiter) ───────────────────────────────────────────────
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const {
            keyword = "",
            sort = "newest",
            page = 1,
            limit = 20
        } = req.query;

        const query = { created_by: adminId };
        if (keyword.trim()) {
            query.$or = [
                { title: { $regex: keyword.trim(), $options: "i" } },
                { location: { $regex: keyword.trim(), $options: "i" } }
            ];
        }

        const sortMap = {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 }
        };
        const sortOrder = sortMap[sort] || { createdAt: -1 };

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;

        const [jobs, total] = await Promise.all([
            Job.find(query)
                .populate({ path: "company" })
                .sort(sortOrder)
                .skip(skip)
                .limit(limitNum),
            Job.countDocuments(query)
        ]);

        return res.status(200).json({
            jobs,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            },
            success: true
        });
    } catch (error) {
        console.error("[getAdminJobs]", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};