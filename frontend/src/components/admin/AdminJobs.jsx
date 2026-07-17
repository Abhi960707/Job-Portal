import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Edit2, Eye, Plus, Search, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import useGetAdminJobs from '@/hooks/useGetAdminJobs'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { setAdminJobs } from '@/redux/jobSlice'
import { toast } from 'sonner'
import BackButton from '../shared/BackButton'

const ITEMS_PER_PAGE = 10;

const AdminJobs = () => {
    useGetAdminJobs();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { adminJobs } = useSelector(store => store.job);
    const [filterText, setFilterText] = useState("");
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        if (adminJobs) {
            const filtered = adminJobs.filter(job =>
                job.title?.toLowerCase().includes(filterText.toLowerCase()) ||
                job.company?.name?.toLowerCase().includes(filterText.toLowerCase())
            );
            setFilteredJobs(filtered);
            setCurrentPage(1);
        }
    }, [adminJobs, filterText]);

    const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
    const paginatedJobs = filteredJobs.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleDelete = async (jobId, jobTitle) => {
        if (!window.confirm(`Are you sure you want to delete "${jobTitle}"? This action cannot be undone.`)) return;
        try {
            setDeletingId(jobId);
            const res = await axios.delete(`${JOB_API_END_POINT}/delete/${jobId}`, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(setAdminJobs(adminJobs.filter(j => j._id !== jobId)));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete job");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10 px-4'>
                <div className='mb-4'>
                    <BackButton to="/admin/dashboard" label="Back to Dashboard" />
                </div>
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
                                <TableHead className="text-center">Total Applicants</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                paginatedJobs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                            No jobs found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedJobs.map((job) => (
                                        <TableRow key={job._id} className="hover:bg-gray-50 transition duration-150">
                                            <TableCell className="font-medium text-gray-800">{job.company?.name || "N/A"}</TableCell>
                                            <TableCell className="font-semibold text-gray-800">{job.title}</TableCell>
                                            <TableCell>{job.location}</TableCell>
                                            <TableCell>{job.salary} LPA</TableCell>
                                            <TableCell>{job.position}</TableCell>
                                            <TableCell>{job.createdAt?.split("T")[0] || "N/A"}</TableCell>
                                            <TableCell className="text-center">
                                                <Button
                                                    onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="hover:bg-blue-50 flex items-center gap-2 text-blue-600 mx-auto font-semibold"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    <span>{job.applications?.length || 0} Applicants</span>
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        onClick={() => navigate(`/admin/jobs/${job._id}/edit`)}
                                                        variant="ghost"
                                                        size="icon"
                                                        className="hover:bg-blue-50 rounded-full"
                                                        title="Edit Job"
                                                    >
                                                        <Edit2 className="h-4 w-4 text-blue-600" />
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDelete(job._id, job.title)}
                                                        variant="ghost"
                                                        size="icon"
                                                        className="hover:bg-red-50 rounded-full"
                                                        title="Delete Job"
                                                        disabled={deletingId === job._id}
                                                    >
                                                        <Trash2 className={`h-4 w-4 ${deletingId === job._id ? 'text-gray-300' : 'text-red-500'}`} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )
                            }
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 px-1">
                        <p className="text-sm text-gray-500">
                            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredJobs.length)} of {filteredJobs.length} jobs
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-1"
                            >
                                <ChevronLeft className="h-4 w-4" /> Prev
                            </Button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentPage(page)}
                                    className={currentPage === page ? "bg-[#6A38C2] text-white hover:bg-[#5d07f1]" : ""}
                                >
                                    {page}
                                </Button>
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-1"
                            >
                                Next <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminJobs
