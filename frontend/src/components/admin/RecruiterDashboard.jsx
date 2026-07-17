import React from 'react'
import Navbar from '../shared/Navbar'
import { Building2, Briefcase, Users, ArrowUpRight, PlusCircle, Building } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetCompany from '@/hooks/useGetCompany'
import useGetAdminJobs from '@/hooks/useGetAdminJobs'
import { Button } from '../ui/button'
import BackButton from '../shared/BackButton'

const RecruiterDashboard = () => {
    useGetCompany();
    useGetAdminJobs();
    const navigate = useNavigate();

    const { companies } = useSelector(store => store.company);
    const { adminJobs } = useSelector(store => store.job);

    const totalCompanies = companies?.length || 0;
    const totalJobs = adminJobs?.length || 0;
    const totalApplicants = adminJobs?.reduce((sum, job) => sum + (job.applications?.length || 0), 0) || 0;

    return (
        <div className="bg-gray-50 min-h-screen pb-10">
            <Navbar />
            <div className="max-w-6xl mx-auto mt-6 px-4">
                <BackButton to="/" label="Back to Home" />
            </div>
            <div className="max-w-6xl mx-auto mt-4 px-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <h1 className="font-bold text-3xl text-gray-900">Dashboard</h1>
                        <p className="text-gray-500 mt-1">Overview of your companies, jobs, and applicants.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Button 
                            onClick={() => navigate("/admin/companies/create")} 
                            variant="outline"
                            className="border-[#6A38C2] text-[#6A38C2] hover:bg-purple-50 flex items-center gap-2"
                        >
                            <Building className="h-4 w-4" /> Add Company
                        </Button>
                        <Button 
                            onClick={() => navigate("/admin/jobs/create")} 
                            className="bg-[#6A38C2] hover:bg-[#5d07f1] text-white flex items-center gap-2 shadow-sm"
                        >
                            <PlusCircle className="h-4 w-4" /> Post Job
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Companies Stats */}
                    <div onClick={() => navigate("/admin/companies")} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-purple-200 transition-all duration-300 cursor-pointer relative group">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-500 font-medium">Registered Companies</span>
                            <div className="p-3 bg-purple-50 rounded-xl text-[#6A38C2] group-hover:bg-[#6A38C2] group-hover:text-white transition-colors">
                                <Building2 className="h-6 w-6" />
                            </div>
                        </div>
                        <h2 className="text-4xl font-extrabold text-gray-900">{totalCompanies}</h2>
                        <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-[#6A38C2] group-hover:translate-x-1 transition-transform">
                            Manage Companies <ArrowUpRight className="h-3 w-3" />
                        </div>
                    </div>

                    {/* Jobs Stats */}
                    <div onClick={() => navigate("/admin/jobs")} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer relative group">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-500 font-medium">Active Jobs</span>
                            <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Briefcase className="h-6 w-6" />
                            </div>
                        </div>
                        <h2 className="text-4xl font-extrabold text-gray-900">{totalJobs}</h2>
                        <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                            Manage Jobs <ArrowUpRight className="h-3 w-3" />
                        </div>
                    </div>

                    {/* Applicants Stats */}
                    <div onClick={() => navigate("/admin/applicants")} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-green-200 transition-all duration-300 cursor-pointer relative group">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-500 font-medium">Total Applicants</span>
                            <div className="p-3 bg-green-50 rounded-xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <Users className="h-6 w-6" />
                            </div>
                        </div>
                        <h2 className="text-4xl font-extrabold text-gray-900">{totalApplicants}</h2>
                        <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-green-600 group-hover:translate-x-1 transition-transform">
                            View All Applicants <ArrowUpRight className="h-3 w-3" />
                        </div>
                    </div>
                </div>

                {/* Quick actions for empty states */}
                {totalCompanies === 0 && (
                     <div className="bg-gradient-to-r from-purple-50 to-white border border-purple-100 rounded-2xl p-8 text-center shadow-sm">
                         <div className="mx-auto bg-white w-16 h-16 rounded-full flex items-center justify-center shadow-sm mb-4">
                            <Building2 className="h-8 w-8 text-[#6A38C2]" />
                         </div>
                         <h3 className="text-xl font-bold text-gray-900 mb-2">Get started by adding a company</h3>
                         <p className="text-gray-500 mb-6 max-w-md mx-auto">You need to register at least one company before you can start posting jobs and reviewing applicants.</p>
                         <Button onClick={() => navigate("/admin/companies/create")} className="bg-[#6A38C2] hover:bg-[#5d07f1] text-white">
                            Register Your First Company
                         </Button>
                     </div>
                )}

            </div>
        </div>
    )
}

export default RecruiterDashboard
