import { Company } from "../models/company.model.js";
import getDatauri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// URL validation helper
const isValidUrl = (str) => {
    try {
        const url = new URL(str);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
};

// ─── REGISTER COMPANY ─────────────────────────────────────────────────────────
export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;

        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }

        const trimmedName = companyName.trim();
        if (trimmedName.length < 2) {
            return res.status(422).json({
                message: "Company name must be at least 2 characters.",
                success: false
            });
        }
        if (trimmedName.length > 100) {
            return res.status(422).json({
                message: "Company name must not exceed 100 characters.",
                success: false
            });
        }

        // Duplicate check (case-insensitive)
        const existing = await Company.findOne({
            name: { $regex: `^${trimmedName}$`, $options: "i" }
        });
        if (existing) {
            return res.status(409).json({
                message: "A company with this name is already registered.",
                success: false
            });
        }

        const company = await Company.create({
            name: trimmedName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        });
    } catch (error) {
        console.error("[registerCompany]", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// ─── GET ALL COMPANIES (for logged-in recruiter) ───────────────────────────────
export const getCompany = async (req, res) => {
    try {
        const userId = req.id;
        const companies = await Company.find({ userId }).sort({ createdAt: -1 });
        return res.status(200).json({
            companies,
            success: true
        });
    } catch (error) {
        console.error("[getCompany]", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// ─── GET COMPANY BY ID ─────────────────────────────────────────────────────────
export const getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }
        return res.status(200).json({ company, success: true });
    } catch (error) {
        console.error("[getCompanyById]", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// ─── UPDATE COMPANY ────────────────────────────────────────────────────────────
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        const file = req.file;

        // Verify the company belongs to this recruiter
        const existing = await Company.findById(req.params.id);
        if (!existing) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }
        if (String(existing.userId) !== String(req.id)) {
            return res.status(403).json({
                message: "You are not authorized to update this company.",
                success: false
            });
        }

        const updateData = {};

        // Validate + update name
        if (name !== undefined) {
            const trimmedName = name.trim();
            if (trimmedName.length < 2 || trimmedName.length > 100) {
                return res.status(422).json({
                    message: "Company name must be between 2 and 100 characters.",
                    success: false
                });
            }
            // Check duplicate (excluding current company)
            const duplicate = await Company.findOne({
                name: { $regex: `^${trimmedName}$`, $options: "i" },
                _id: { $ne: req.params.id }
            });
            if (duplicate) {
                return res.status(409).json({
                    message: "Another company with this name already exists.",
                    success: false
                });
            }
            updateData.name = trimmedName;
        }

        // Description
        if (description !== undefined) {
            updateData.description = description.slice(0, 1000);
        }

        // Website URL format validation
        if (website !== undefined && website.trim() !== "") {
            if (!isValidUrl(website.trim())) {
                return res.status(422).json({
                    message: "Please enter a valid website URL (e.g. https://example.com).",
                    success: false
                });
            }
            updateData.website = website.trim();
        } else if (website !== undefined) {
            updateData.website = "";
        }

        // Location
        if (location !== undefined) {
            updateData.location = location.trim();
        }

        // Logo upload
        if (file) {
            const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
            if (!allowedTypes.includes(file.mimetype)) {
                return res.status(422).json({
                    message: "Company logo must be a JPEG, PNG, or WebP image.",
                    success: false
                });
            }
            if (file.size > 2 * 1024 * 1024) {
                return res.status(422).json({
                    message: "Logo image must not exceed 2 MB.",
                    success: false
                });
            }
            const fileUri = getDatauri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                folder: "job-portal/logos",
                resource_type: "image"
            });
            updateData.logo = cloudResponse.secure_url;
        }

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        return res.status(200).json({
            message: "Company updated successfully.",
            company,
            success: true
        });
    } catch (error) {
        console.error("[updateCompany]", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// ─── DELETE COMPANY ────────────────────────────────────────────────────────────
export const deleteCompany = async (req, res) => {
    try {
        const existing = await Company.findById(req.params.id);
        if (!existing) {
            return res.status(404).json({ message: "Company not found.", success: false });
        }
        if (String(existing.userId) !== String(req.id)) {
            return res.status(403).json({ message: "You are not authorized to delete this company.", success: false });
        }
        await Company.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Company deleted successfully.", success: true });
    } catch (error) {
        console.error("[deleteCompany]", error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};