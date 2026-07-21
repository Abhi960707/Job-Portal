import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { JOB_API_END_POINT, APPLICATION_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Navbar from './shared/Navbar';
import { Loader2, AlertCircle } from 'lucide-react';
import BackButton from './shared/BackButton';

const JobDescription = () => {
    const params = useParams();
    const jobId = params.id;
    const navigate = useNavigate();
    const { singleJob } = useSelector(store => store.job);
    const { user, token } = useSelector(store => store.auth) // Get token for Authorization header
    const dispatch = useDispatch();
    const [fetchError, setFetchError] = useState(false); // ← tracks failed fetch

    const isApplied = singleJob?.applications?.some(application => application.applicant === user?._id || application.applicant?._id === user?._id) || false;

    const applyJobHandler = async () => {
        if (!user) {
            toast.error("Please login to apply for this job.");
            navigate("/login");
            return;
        }

        if (user.role === 'recruiter') {
            toast.error("Recruiters cannot apply for jobs.");
            return;
        }

        try {
            const res = await axios.post(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {}, {
                withCredentials: true,
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            if (res.data.success) {
                toast.success(res.data.message);
                const updatedApplications = [...(singleJob.applications || []), { applicant: user?._id }];
                dispatch(setSingleJob({ ...singleJob, applications: updatedApplications }));
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to apply");
        }
    }

    useEffect(() => {
        // Clear previous job & error state when jobId changes
        setFetchError(false);
        dispatch(setSingleJob(null));

        const fetchSingleJob = async () => {
            try {
                // Send both cookie and Authorization header:
                // - withCredentials: sends cookie if browser allows (same-origin or sameSite=none)
                // - Authorization: Bearer token fallback (works cross-origin regardless of cookies)
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
                    withCredentials: true,
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                } else {
                    setFetchError(true);
                }
            } catch (error) {
                console.log(error);
                setFetchError(true);
            }
        }
        fetchSingleJob();
    }, [jobId, dispatch, token])

    // ── Error State ─────────────────────────────────────────────────────────────
    if (fetchError) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-4xl mx-auto mt-6 px-4">
                    <BackButton label="Back to Jobs" />
                </div>
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                    <AlertCircle className="h-14 w-14 text-red-400" />
                    <h2 className="text-2xl font-bold text-gray-800">Job Not Found</h2>
                    <p className="text-gray-500">This job may have been removed or the link is invalid.</p>
                    <Button onClick={() => navigate('/jobs')} className="mt-4 bg-[#6A38C2] hover:bg-[#5d07f1] text-white px-6">
                        Browse Jobs
                    </Button>
                </div>
            </div>
        )
    }

    // ── Loading State ────────────────────────────────────────────────────────────
    if (!singleJob) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-[#6A38C2]" />
            </div>
        )
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-10">
            <Navbar />
            <div className='max-w-4xl mx-auto mt-6 px-4'>
                <BackButton label="Back to Jobs" />
            </div>
            <div className='max-w-4xl mx-auto mt-4 px-4 bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
                
                {/* Header */}
                <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
                    <div>
                        <h1 className='font-bold text-3xl text-gray-900'>{singleJob?.title}</h1>
                        <div className='flex items-center gap-3 mt-4 flex-wrap'>
                            <Badge className={'text-blue-700 font-bold bg-blue-50 border-none px-3 py-1'} variant="secondary">{singleJob?.position} Positions</Badge>
                            <Badge className={'text-red-700 font-bold bg-red-50 border-none px-3 py-1'} variant="secondary">{singleJob?.jobType}</Badge>
                            <Badge className={'text-purple-700 font-bold bg-purple-50 border-none px-3 py-1'} variant="secondary">{singleJob?.salary} LPA</Badge>
                        </div>
                    </div>
                    
                    <Button
                        onClick={isApplied ? null : applyJobHandler}
                        disabled={isApplied}
                        className={`rounded-xl px-8 py-6 font-semibold text-white text-md transition duration-200 w-full md:w-auto shadow-md ${
                            isApplied 
                            ? 'bg-gray-400 cursor-not-allowed shadow-none' 
                            : !user 
                                ? 'bg-orange-500 hover:bg-orange-600'
                                : 'bg-[#6A38C2] hover:bg-[#5d07f1]'
                        }`}
                    >
                        {isApplied ? 'Already Applied' : !user ? 'Login to Apply' : 'Apply Now'}
                    </Button>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100">
                    <h2 className='font-bold text-xl mb-6 text-gray-800'>Job Description</h2>
                    
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12'>
                        <div className="flex flex-col space-y-1">
                            <span className="text-sm text-gray-500 font-medium">Role</span>
                            <span className="font-semibold text-gray-900">{singleJob?.title}</span>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <span className="text-sm text-gray-500 font-medium">Location</span>
                            <span className="font-semibold text-gray-900">{singleJob?.location}</span>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <span className="text-sm text-gray-500 font-medium">Experience</span>
                            <span className="font-semibold text-gray-900">{singleJob?.experienceLevel} Years</span>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <span className="text-sm text-gray-500 font-medium">Salary</span>
                            <span className="font-semibold text-gray-900">{singleJob?.salary} LPA</span>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <span className="text-sm text-gray-500 font-medium">Posted Date</span>
                            <span className="font-semibold text-gray-900">{singleJob?.createdAt ? new Date(singleJob.createdAt).toLocaleDateString('en-GB') : "N/A"}</span>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <span className="text-sm text-gray-500 font-medium">Total Applicants</span>
                            <span className="font-semibold text-gray-900">{singleJob?.applications?.length || 0} applicants</span>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                         <span className="text-sm text-gray-500 font-medium block mb-2">Description</span>
                         <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{singleJob?.description}</p>
                    </div>

                    {singleJob?.requirements && singleJob.requirements.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <span className="text-sm text-gray-500 font-medium block mb-3">Requirements</span>
                            <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                {singleJob.requirements.map((req, index) => (
                                    <li key={index} className="leading-relaxed">{req}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default JobDescription