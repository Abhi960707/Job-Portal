// export const USER_API_END_POINT="http://localhost:8000/api/v1/user";
// export const JOB_API_END_POINT="http://localhost:8000/api/v1/job";
// export const COMPANY_API_END_POINT="http://localhost:8000/api/v1/company";
// export const APPLICATION_API_END_POINT="http://localhost:8000/api/v1/application";

// Fallback ensures local dev works even without .env; production uses VITE_API_URL from Vercel env vars
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const USER_API_END_POINT = `${API_URL}/user`;
export const JOB_API_END_POINT = `${API_URL}/job`;
export const COMPANY_API_END_POINT = `${API_URL}/company`;
export const APPLICATION_API_END_POINT = `${API_URL}/application`;