// Dynamic API URL resolution:
// - On localhost/127.0.0.1: automatically connects to local backend (http://localhost:8000/api/v1)
// - On production (Vercel/live): automatically connects to Render backend (https://job-portal-backend-xlix.onrender.com/api/v1)
// - Can also be overridden by VITE_API_URL in environment settings
const getApiUrl = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
        return "http://localhost:8000/api/v1";
    }
    return "https://job-portal-backend-xlix.onrender.com/api/v1";
};

const API_URL = getApiUrl();

export const USER_API_END_POINT = `${API_URL}/user`;
export const JOB_API_END_POINT = `${API_URL}/job`;
export const COMPANY_API_END_POINT = `${API_URL}/company`;
export const APPLICATION_API_END_POINT = `${API_URL}/application`;