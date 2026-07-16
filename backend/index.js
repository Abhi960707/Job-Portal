import "dotenv/config";
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import comapanyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", comapanyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "Server is running.", success: true });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        message: `Route ${req.originalUrl} not found.`,
        success: false
    });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error("[GLOBAL ERROR]", err);
    res.status(err.status || 500).json({
        message: err.message || "Internal server error.",
        success: false
    });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, async () => {
    await connectDB();
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});