import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDatauri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10}$/;

// ─── REGISTER ─────────────────────────────────────────────────────────────────
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        // 1. Required field checks
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "All fields are required (fullname, email, phoneNumber, password, role).",
                success: false
            });
        }

        // 2. Fullname validation
        const trimmedName = fullname.trim();
        if (trimmedName.length < 2 || trimmedName.length > 60) {
            return res.status(422).json({
                message: "Full name must be between 2 and 60 characters.",
                success: false
            });
        }

        // 3. Email format
        if (!EMAIL_REGEX.test(email.trim())) {
            return res.status(422).json({
                message: "Please enter a valid email address.",
                success: false
            });
        }

        // 4. Phone validation – 10 digits
        const cleanPhone = String(phoneNumber).replace(/\s/g, "");
        if (!PHONE_REGEX.test(cleanPhone)) {
            return res.status(422).json({
                message: "Phone number must be exactly 10 digits.",
                success: false
            });
        }

        // 5. Password length
        if (password.length < 4) {
            return res.status(422).json({
                message: "Password must be at least 4 characters.",
                success: false
            });
        }
        if (password.length > 100) {
            return res.status(422).json({
                message: "Password must not exceed 100 characters.",
                success: false
            });
        }

        // 6. Role validation
        if (!["student", "recruiter"].includes(role)) {
            return res.status(422).json({
                message: "Role must be either 'student' or 'recruiter'.",
                success: false
            });
        }

        // 7. Duplicate email check
        const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                message: "An account with this email already exists.",
                success: false
            });
        }

        // 8. Handle profile photo upload
        const file = req.file;
        let profilePhoto = "";
        if (file) {
            // Validate image type
            const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
            if (!allowedImageTypes.includes(file.mimetype)) {
                return res.status(422).json({
                    message: "Profile photo must be a JPEG, PNG, WebP, or GIF image.",
                    success: false
                });
            }
            // Max 5 MB
            if (file.size > 5 * 1024 * 1024) {
                return res.status(422).json({
                    message: "Profile photo must not exceed 5 MB.",
                    success: false
                });
            }
            const fileUri = getDatauri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                folder: "job-portal/profiles",
                resource_type: "image"
            });
            profilePhoto = cloudResponse.secure_url;
        }

        // 9. Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // 10. Create user
        await User.create({
            fullname: trimmedName,
            email: email.trim().toLowerCase(),
            phoneNumber: Number(cleanPhone),
            password: hashedPassword,
            role,
            profile: {
                profilePhoto
            }
        });

        return res.status(201).json({
            message: "Account created successfully! Please log in.",
            success: true
        });
    } catch (error) {
        console.error("[register]", error);
        return res.status(500).json({
            message: "Internal server error. Please try again.",
            success: false
        });
    }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // 1. Required fields
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Email, password, and role are required.",
                success: false
            });
        }

        // 2. Email format
        if (!EMAIL_REGEX.test(email.trim())) {
            return res.status(422).json({
                message: "Please enter a valid email address.",
                success: false
            });
        }

        // 3. Role validation
        if (!["student", "recruiter"].includes(role)) {
            return res.status(422).json({
                message: "Role must be either 'student' or 'recruiter'.",
                success: false
            });
        }

        // 4. Find user
        let user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password.",
                success: false
            });
        }

        // 5. Password comparison
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password.",
                success: false
            });
        }

        // 6. Role mismatch
        if (role !== user.role) {
            return res.status(403).json({
                message: `No ${role} account found with this email. Please check your role.`,
                success: false
            });
        }

        // 7. Generate token
        const tokenData = { userId: user._id };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });

        // 8. Sanitize user object returned to client
        const safeUser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        const isProduction = process.env.NODE_ENV === "production";

        return res
            .status(200)
            .cookie("token", token, {
                maxAge: 24 * 60 * 60 * 1000, // 1 day
                httpOnly: true,
                sameSite: isProduction ? "none" : "lax", // "none" required for cross-origin (Vercel → Render)
                secure: isProduction                      // "none" requires secure: true in production
            })
            .json({
                message: `Welcome back, ${user.fullname}!`,
                user: safeUser,
                token, // ← Also send token in body so frontend can use it as Authorization header
                success: true
            });
    } catch (error) {
        console.error("[login]", error);
        return res.status(500).json({
            message: "Internal server error. Please try again.",
            success: false
        });
    }
};

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
export const logout = async (req, res) => {
    try {
        const isProduction = process.env.NODE_ENV === "production";

        return res
            .status(200)
            .cookie("token", "", {
                maxAge: 0,
                httpOnly: true,
                sameSite: isProduction ? "none" : "lax", // Must match login cookie settings to clear properly
                secure: isProduction                      // Required when sameSite: "none"
            })
            .json({
                message: "Logged out successfully.",
                success: true
            });
    } catch (error) {
        console.error("[logout]", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// ─── UPDATE PROFILE ───────────────────────────────────────────────────────────
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;
        const userId = req.id;

        // Find user
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        // Validate fullname if provided
        if (fullname !== undefined) {
            const trimmedName = fullname.trim();
            if (trimmedName.length < 2 || trimmedName.length > 60) {
                return res.status(422).json({
                    message: "Full name must be between 2 and 60 characters.",
                    success: false
                });
            }
            user.fullname = trimmedName;
        }

        // Validate email if provided
        if (email !== undefined) {
            if (!EMAIL_REGEX.test(email.trim())) {
                return res.status(422).json({
                    message: "Please enter a valid email address.",
                    success: false
                });
            }
            // Check for duplicate (excluding current user)
            const emailExists = await User.findOne({
                email: email.trim().toLowerCase(),
                _id: { $ne: userId }
            });
            if (emailExists) {
                return res.status(409).json({
                    message: "This email is already used by another account.",
                    success: false
                });
            }
            user.email = email.trim().toLowerCase();
        }

        // Validate phone if provided
        if (phoneNumber !== undefined && phoneNumber !== "") {
            const cleanPhone = String(phoneNumber).replace(/\s/g, "");
            if (!PHONE_REGEX.test(cleanPhone)) {
                return res.status(422).json({
                    message: "Phone number must be exactly 10 digits.",
                    success: false
                });
            }
            user.phoneNumber = Number(cleanPhone);
        }

        // Bio
        if (bio !== undefined) {
            user.profile.bio = bio.slice(0, 500); // max 500 chars
        }

        // Skills – comma-separated string
        if (skills !== undefined && skills !== "") {
            user.profile.skills = skills
                .split(",")
                .map(s => s.trim())
                .filter(Boolean);
        }

        // Handle resume / profile photo upload
        if (file) {
            const isPDF = file.mimetype === "application/pdf";
            const isImage = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);

            if (!isPDF && !isImage) {
                return res.status(422).json({
                    message: "Only PDF (resume) or image (profile photo) files are allowed.",
                    success: false
                });
            }
            if (file.size > 5 * 1024 * 1024) {
                return res.status(422).json({
                    message: "File must not exceed 5 MB.",
                    success: false
                });
            }

            const fileUri = getDatauri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                folder: isPDF ? "job-portal/resumes" : "job-portal/profiles",
                resource_type: isPDF ? "raw" : "image"
            });

            if (isPDF) {
                user.profile.resume = cloudResponse.secure_url;
                user.profile.resumeOriginalName = file.originalname;
            } else {
                user.profile.profilePhoto = cloudResponse.secure_url;
            }
        }

        await user.save();

        const safeUser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: safeUser,
            success: true
        });
    } catch (error) {
        console.error("[updateProfile]", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};