import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { setApplicants } from '@/redux/applicationSlice'
import { toast } from 'sonner'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { MoreHorizontal, Check, X, FileText, ArrowLeft } from 'lucide-react'
import { Button } from '../ui/button'

const Applicants = () => {
    const params = useParams();
    const jobId = params.id;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { applicants } = useSelector(store => store.application);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${jobId}/applicants`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setApplicants(res.data.job));
                }
            } catch (error) {
                console.log(error);
                toast.error("Failed to load applicants");
            }
        };
        fetchApplicants();
    }, [jobId, dispatch]);

    const statusHandler = async (status, id) => {
        try {
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status }, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message);
                
                // Locally update status in state
                const updatedApplications = applicants.applications.map(app => 
                    app._id === id ? { ...app, status: status.toLowerCase() } : app
                );
                dispatch(setApplicants({ ...applicants, applications: updatedApplications }));
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    }

    return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10 px-4'>
                <div className='flex items-center gap-4 justify-between border-b pb-4 mb-6'>
                    <Button onClick={() => navigate("/admin/jobs")} variant="ghost" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="h-4 w-4" /> Back to Jobs
                    </Button>
                    <h1 className='font-bold text-xl text-gray-800'>
                        Applicants ({applicants?.applications?.length || 0})
                    </h1>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Full Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Skills</TableHead>
                                <TableHead>Resume</TableHead>
                                <TableHead>Applied Date</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                !applicants?.applications || applicants.applications.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                            No applicants for this job yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    applicants.applications.map((app) => (
                                        <TableRow key={app._id} className="hover:bg-gray-50 transition duration-150">
                                            <TableCell className="font-semibold text-gray-800">{app.applicant?.fullname}</TableCell>
                                            <TableCell>{app.applicant?.email}</TableCell>
                                            <TableCell>{app.applicant?.phoneNumber}</TableCell>
                                            <TableCell className="max-w-[200px] truncate">
                                                {app.applicant?.profile?.skills?.join(", ") || "N/A"}
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    app.applicant?.profile?.resume ? (
                                                        <a href={app.applicant.profile.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                                            <FileText className="h-4 w-4" /> View PDF
                                                        </a>
                                                    ) : "No Resume"
                                                }
                                            </TableCell>
                                            <TableCell>{app.createdAt?.split("T")[0] || "N/A"}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <span className={`text-xs px-2 py-1 rounded-full font-semibold border uppercase ${
                                                        app.status === 'accepted' ? 'text-green-700 bg-green-50 border-green-200' :
                                                        app.status === 'rejected' ? 'text-red-700 bg-red-50 border-red-200' :
                                                        'text-yellow-700 bg-yellow-50 border-yellow-200'
                                                    }`}>
                                                        {app.status}
                                                    </span>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-full h-8 w-8">
                                                                <MoreHorizontal className="h-4 w-4 text-gray-600" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-36 p-1">
                                                            <div className="flex flex-col">
                                                                <button onClick={() => statusHandler("accepted", app._id)} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-green-700 hover:bg-green-50 rounded-md transition duration-150 font-medium">
                                                                    <Check className="h-4 w-4" /> Accept
                                                                </button>
                                                                <button onClick={() => statusHandler("rejected", app._id)} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-red-700 hover:bg-red-50 rounded-md transition duration-150 font-medium">
                                                                    <X className="h-4 w-4" /> Reject
                                                                </button>
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
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

export default Applicants
