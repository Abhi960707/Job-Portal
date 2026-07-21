import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import useGetCompany from '@/hooks/useGetCompany'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import BackButton from '../shared/BackButton'

const VALID_JOB_TYPES = ["Full-Time", "Part-Time", "Internship", "Contract", "Remote"];

const PostJob = () => {
    useGetCompany();
    const navigate = useNavigate();
    const { companies } = useSelector(store => store.company);
    const [loading, setLoading] = useState(false);

    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "Full-Time",
        experience: "",
        position: "",
        companyId: ""
    });

    const [errors, setErrors] = useState({});

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    }

    const selectChangeHandler = (e) => {
        setInput({ ...input, companyId: e.target.value });
        if (errors.companyId) setErrors(prev => ({ ...prev, companyId: "" }));
    }

    const validate = () => {
        const newErrors = {};
        if (!input.title.trim() || input.title.trim().length < 3) newErrors.title = "Title must be at least 3 characters.";
        if (!input.description.trim()) newErrors.description = "Description is required.";
        if (!input.requirements.trim()) newErrors.requirements = "Requirements are required.";
        
        const salaryNum = Number(input.salary);
        if (input.salary === "" || isNaN(salaryNum) || salaryNum < 0) newErrors.salary = "Enter a valid positive number for salary.";
        
        if (!input.location.trim()) newErrors.location = "Location is required.";
        if (!VALID_JOB_TYPES.includes(input.jobType)) newErrors.jobType = "Select a valid job type.";
        
        const expNum = Number(input.experience);
        if (input.experience === "" || isNaN(expNum) || expNum < 0) newErrors.experience = "Enter a valid non-negative number.";
        
        const posNum = Number(input.position);
        if (input.position === "" || !Number.isInteger(posNum) || posNum < 1) newErrors.position = "Positions must be at least 1.";
        
        if (!input.companyId) newErrors.companyId = "Please select a company.";

        return newErrors;
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to post job");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            <Navbar />
            <div className='max-w-3xl mx-auto my-10 px-4'>
                <form onSubmit={submitHandler} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 space-y-6">
                    <div className='flex items-center gap-4 justify-between border-b pb-4'>
                        <BackButton to="/admin/jobs" label="Back to Jobs" />
                        <h1 className='font-bold text-2xl text-gray-800'>Post New Job</h1>
                    </div>

                    {
                        companies.length === 0 ? (
                            <div className="text-center py-6 text-red-600 bg-red-50 border border-red-100 rounded-lg font-medium">
                                * Please register a company first before posting a job.
                            </div>
                        ) : null
                    }

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="title" className="font-semibold text-gray-700">Job Title / Role</Label>
                            <Input
                                id="title"
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                                placeholder="Software Engineer, Product Manager"
                                className={errors.title ? "border-red-400" : ""}
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="description" className="font-semibold text-gray-700">Job Description</Label>
                            <Input
                                id="description"
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                placeholder="Responsibilities, roles..."
                                className={errors.description ? "border-red-400" : ""}
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="requirements" className="font-semibold text-gray-700">Requirements / Skills</Label>
                            <Input
                                id="requirements"
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                placeholder="React, Node.js (comma separated)"
                                className={errors.requirements ? "border-red-400" : ""}
                            />
                             {errors.requirements && <p className="text-red-500 text-xs mt-1">{errors.requirements}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="salary" className="font-semibold text-gray-700">Salary (LPA)</Label>
                            <Input
                                id="salary"
                                type="number"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                                placeholder="12, 18, 25"
                                min="0"
                                step="0.1"
                                className={errors.salary ? "border-red-400" : ""}
                            />
                            {errors.salary && <p className="text-red-500 text-xs mt-1">{errors.salary}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="location" className="font-semibold text-gray-700">Location</Label>
                            <Input
                                id="location"
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                placeholder="Remote, Bangalore, Mumbai"
                                className={errors.location ? "border-red-400" : ""}
                            />
                             {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="jobType" className="font-semibold text-gray-700">Job Type</Label>
                            <select
                                id="jobType"
                                name="jobType"
                                value={input.jobType}
                                onChange={changeEventHandler}
                                className={`w-full bg-white border rounded-md h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${errors.jobType ? 'border-red-400' : 'border-input'}`}
                            >
                                {VALID_JOB_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            {errors.jobType && <p className="text-red-500 text-xs mt-1">{errors.jobType}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="experience" className="font-semibold text-gray-700">Experience Level (Years)</Label>
                            <Input
                                id="experience"
                                type="number"
                                name="experience"
                                value={input.experience}
                                onChange={changeEventHandler}
                                placeholder="e.g. 2, 5"
                                min="0"
                                className={errors.experience ? "border-red-400" : ""}
                            />
                             {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="position" className="font-semibold text-gray-700">No. of Positions</Label>
                            <Input
                                id="position"
                                type="number"
                                name="position"
                                value={input.position}
                                onChange={changeEventHandler}
                                placeholder="e.g. 3, 10"
                                min="1"
                                className={errors.position ? "border-red-400" : ""}
                            />
                            {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
                        </div>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-gray-100">
                        <Label htmlFor="company" className="font-semibold text-gray-700">Select Company</Label>
                        <select
                            id="company"
                            value={input.companyId}
                            onChange={selectChangeHandler}
                            className={`w-full bg-white border rounded-md h-11 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${errors.companyId ? 'border-red-400' : 'border-input'}`}
                        >
                            <option value="">-- Choose a registered company --</option>
                            {
                                companies.map((company) => (
                                    <option key={company._id} value={company._id}>{company.name}</option>
                                ))
                            }
                        </select>
                        {errors.companyId && <p className="text-red-500 text-xs mt-1">{errors.companyId}</p>}
                    </div>

                    <div className="pt-4">
                        {
                            loading ? (
                                <Button disabled className="w-full h-11 bg-[#6A38C2] text-white">
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Posting Job...
                                </Button>
                            ) : (
                                <Button type="submit" disabled={companies.length === 0} className="w-full h-11 bg-[#6A38C2] hover:bg-[#5d07f1] text-white font-semibold text-md rounded-xl transition-colors shadow-md">
                                    Post Job
                                </Button>
                            )
                        }
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PostJob
