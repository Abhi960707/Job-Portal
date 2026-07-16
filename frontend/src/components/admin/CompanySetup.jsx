import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useSelector } from 'react-redux'
import useGetCompanyById from '@/hooks/useGetCompanyById'
import { toast } from 'sonner'

const CompanySetup = () => {
    const params = useParams();
    const companyId = params.id;
    useGetCompanyById(companyId);

    const navigate = useNavigate();
    const { singleCompany } = useSelector(store => store.company);
    const [loading, setLoading] = useState(false);

    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });

    useEffect(() => {
        if (singleCompany) {
            setInput({
                name: singleCompany.name || "",
                description: singleCompany.description || "",
                website: singleCompany.website || "",
                location: singleCompany.location || "",
                file: null
            });
        }
    }, [singleCompany]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            setLoading(true);
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${companyId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/companies");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to update company");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Navbar />
            <div className='max-w-xl mx-auto my-10 px-4'>
                <form onSubmit={submitHandler} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 space-y-6">
                    <div className='flex items-center gap-4 justify-between border-b pb-4'>
                        <Button type="button" onClick={() => navigate("/admin/companies")} variant="ghost" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                            <ArrowLeft className="h-4 w-4" /> Back
                        </Button>
                        <h1 className='font-bold text-xl text-gray-800'>Company Setup</h1>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="name" className="font-semibold text-gray-700">Company Name</Label>
                            <Input
                                id="name"
                                type="text"
                                name="name"
                                value={input.name}
                                onChange={changeEventHandler}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="description" className="font-semibold text-gray-700">Description</Label>
                            <Input
                                id="description"
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="website" className="font-semibold text-gray-700">Website URL</Label>
                            <Input
                                id="website"
                                type="text"
                                name="website"
                                value={input.website}
                                onChange={changeEventHandler}
                                placeholder="https://example.com"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="location" className="font-semibold text-gray-700">Location</Label>
                            <Input
                                id="location"
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                placeholder="New York, Delhi etc."
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="file" className="font-semibold text-gray-700">Company Logo</Label>
                            <Input
                                id="file"
                                type="file"
                                accept="image/*"
                                onChange={fileChangeHandler}
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        {
                            loading ? (
                                <Button disabled className="w-full bg-[#6A38C2] text-white">
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                                </Button>
                            ) : (
                                <Button type="submit" className="w-full bg-[#6A38C2] hover:bg-[#5d07f1] text-white font-semibold">
                                    Update Setup
                                </Button>
                            )
                        }
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CompanySetup
