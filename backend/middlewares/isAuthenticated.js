import jwt from "jsonwebtoken"

const isAuthenticated = async (req, res, next) => {
    try {
        // Support both cookie-based auth (primary) and Authorization header (fallback)
        const token = req.cookies.token || (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);

        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            })
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY);
        if (!decode) {
            return res.status(401).json({
                message: "Invalid token",
                success: false
            });
        }

        req.id = decode.userId;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Authentication failed. Please login again.",
            success: false
        })
    }
}
export default isAuthenticated;