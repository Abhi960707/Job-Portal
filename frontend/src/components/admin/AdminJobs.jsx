import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Edit2, Eye, Plus, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetAdminJobs from '@/hooks/useGetAdminJobs'

const AdminJobs = () => {
    useGetAdminJobs();
    const navigate = useNavigate();
    const { adminJobs } = useSelector(store => store.job);
    const [filterText, setFilterText] = useState("");
    const [filteredJobs, setFilteredJobs] = useState([]);

    useEffect(() => {
        if (adminJobs) {
            const filtered = adminJobs.filter(job => 
                job.title?.toLowerCase().includes(filterText.toLowerCase()) ||
                job.company?.name?.toLowerCase().includes(filterText.toLowerCase())
            );
            setFilteredJobs(filtered);
        }
    }, [adminJobs, filterText]);

    return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10 px-4'>
                <div className='flex items-center justify-between gap-4 flex-wrap mb-6'>
                    <div className='flex items-center gap-2 max-w-sm w-full bg-white border border-gray-200 rounded-md px-3 py-1'>
                        <Search className='text-gray-400 h-5 w-5' />
                        <input
                            type="text"
                            placeholder="Filter by title or company..."
                            className='outline-none border-none w-full py-1 text-sm'
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => navigate("/admin/jobs/create")} className="bg-[#6A38C2] hover:bg-[#5d07f1] text-white flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Post New Job
                    </Button>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Company</TableHead>
                                <TableHead>Role / Title</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Salary</TableHead>
                                <TableHead>Positions</TableHead>
                                <TableHead>Created Date</TableHead>
                                <TableHead className="text-right">Applicants</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                filteredJobs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                            No jobs found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredJobs.map((job) => (
                                        <TableRow key={job._id} className="hover:bg-gray-50 transition duration-150">
                                            <TableCell className="font-medium text-gray-800">{job.company?.name || "N/A"}</TableCell>
                                            <TableCell className="font-semibold text-gray-800">{job.title}</TableCell>
                                            <TableCell>{job.location}</TableCell>
                                            <TableCell>{job.salary} LPA</TableCell>
                                            <TableCell>{job.position}</TableCell>
                                            <TableCell>{job.createdAt?.split("T")[0] || "N/A"}</TableCell>
                                            <TableCell className="text-right">
                                                <Button onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)} variant="ghost" size="sm" className="hover:bg-gray-100 flex items-center gap-2 text-blue-600 ml-auto">
                                                    <Eye className="h-4 w-4" /> View ({job.applications?.length || 0})
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )
                            }
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default AdminJobs
