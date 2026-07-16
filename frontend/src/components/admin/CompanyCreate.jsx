import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'
import { toast } from 'sonner'
import { Loader2, Building2 } from 'lucide-react'

const CompanyCreate = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [companyName, setCompanyName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const registerNewCompany = async (e) => {
        e.preventDefault();
        
        // Client-side validation matching backend
        const trimmedName = companyName.trim();
        if (!trimmedName) {
            setError("Company name is required.");
            return;
        }
        if (trimmedName.length < 2) {
            setError("Company name must be at least 2 characters.");
            return;
        }
        if (trimmedName.length > 100) {
            setError("Company name must not exceed 100 characters.");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, { companyName: trimmedName }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (res.data.success) {
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                const companyId = res.data.company?._id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Failed to create company");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            <Navbar />
            <div className='max-w-xl mx-auto my-16 px-4'>
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                    
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#6A38C2] to-[#9b55e5] px-8 py-6 text-white text-center">
                        <div className="flex justify-center mb-3">
                            <div className="bg-white/20 p-3 rounded-full">
                                <Building2 className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h1 className='font-bold text-2xl'>Register Your Company</h1>
                        <p className='text-purple-100 text-sm mt-1'>What would you like to name your company? You can change this later.</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={registerNewCompany} className="p-8 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="companyName" className="font-semibold text-gray-700">Company Name <span className="text-red-500">*</span></Label>
                            <Input
                                id="companyName"
                                type="text"
                                placeholder="e.g. Google, Microsoft, Startup Inc."
                                value={companyName}
                                onChange={(e) => {
                                    setCompanyName(e.target.value);
                                    if(error) setError("");
                                }}
                                className={`h-11 ${error ? "border-red-400 focus-visible:ring-red-300" : ""}`}
                            />
                            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                            <p className="text-xs text-gray-400 mt-2">This name will be visible to applicants on your job postings.</p>
                        </div>
                        
                        <div className='flex items-center gap-4 pt-4 border-t border-gray-100'>
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => navigate("/admin/companies")}
                                className="flex-1 h-11 border-gray-200 text-gray-600 hover:bg-gray-50"
                            >
                                Cancel
                            </Button>
                            {
                                loading ? (
                                    <Button disabled className="flex-1 h-11 bg-[#6A38C2] text-white">
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Creating...
                                    </Button>
                                ) : (
                                    <Button type="submit" className="flex-1 h-11 bg-[#6A38C2] hover:bg-[#5d07f1] text-white font-semibold transition-colors">
                                        Continue Setup
                                    </Button>
                                )
                            }
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CompanyCreate
