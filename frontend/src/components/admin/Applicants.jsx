import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { setApplicants } from '@/redux/applicationSlice'
import { toast } from 'sonner'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { MoreHorizontal, Check, X, FileText, ChevronLeft, ChevronRight, User, Mail, Phone, Briefcase, X as CloseIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import BackButton from '../shared/BackButton'

const ITEMS_PER_PAGE = 10;

const ApplicantProfileModal = ({ app, onClose }) => {
    if (!app) return null;
    const applicant = app.applicant;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative animate-fadeIn"
                onClick={e => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
                >
                    <CloseIcon className="h-5 w-5" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-4 mb-5">
                    <Avatar className="h-16 w-16 border-2 border-purple-200">
                        <AvatarImage src={applicant?.profile?.profilePhoto} alt={applicant?.fullname} />
                        <AvatarFallback className="bg-gradient-to-br from-[#6A38C2] to-[#9b55e5] text-white text-xl font-bold">
                            {applicant?.fullname?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="font-bold text-xl text-gray-900">{applicant?.fullname}</h2>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border uppercase ${
                            app.status === 'accepted' ? 'text-green-700 bg-green-50 border-green-200' :
                            app.status === 'rejected' ? 'text-red-700 bg-red-50 border-red-200' :
                            'text-yellow-700 bg-yellow-50 border-yellow-200'
                        }`}>
                            {app.status}
                        </span>
                    </div>
                </div>

                <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-gray-700">
                        <div className="bg-purple-50 p-2 rounded-full">
                            <Mail className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Email</p>
                            <p className="font-semibold">{applicant?.email || "N/A"}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                        <div className="bg-purple-50 p-2 rounded-full">
                            <Phone className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Phone</p>
                            <p className="font-semibold">{applicant?.phoneNumber || "N/A"}</p>
                        </div>
                    </div>

                    {applicant?.profile?.bio && (
                        <div className="flex items-start gap-3 text-gray-700">
                            <div className="bg-purple-50 p-2 rounded-full mt-0.5">
                                <User className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium">Bio</p>
                                <p className="font-medium">{applicant.profile.bio}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-start gap-3 text-gray-700">
                        <div className="bg-purple-50 p-2 rounded-full mt-0.5">
                            <Briefcase className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Skills</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {applicant?.profile?.skills?.length ? (
                                    applicant.profile.skills.map((skill, i) => (
                                        <Badge key={i} className="bg-gray-800 text-white text-xs px-2 py-0.5">{skill}</Badge>
                                    ))
                                ) : (
                                    <span className="text-gray-400 italic text-xs">No skills listed</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {applicant?.profile?.resume && (
                        <div className="pt-3 border-t border-gray-100">
                            <a 
                                target='_blank' 
                                rel="noreferrer"
                                href={`https://docs.google.com/viewer?url=${encodeURIComponent(applicant.profile.resume)}`} 
                                className='flex items-center gap-2 text-[#6A38C2] font-semibold hover:underline cursor-pointer group'
                            >
                                <FileText className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                {applicant.profile.resumeOriginalName || "View Resume"}
                            </a>
                        </div>
                    )}

                    <p className="text-xs text-gray-400 pt-1">Applied: {app.createdAt?.split("T")[0] || "N/A"}</p>
                </div>
            </div>
        </div>
    );
};

const Applicants = () => {
    const params = useParams();
    const jobId = params.id;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { applicants } = useSelector(store => store.application);
    const { token } = useSelector(store => store.auth);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedApplicant, setSelectedApplicant] = useState(null);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${jobId}/applicants`, {
                    withCredentials: true,
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                if (res.data.success) {
                    dispatch(setApplicants(res.data.job));
                }
            } catch (error) {
                console.log(error);
                toast.error("Failed to load applicants");
            }
        };
        fetchApplicants();
    }, [jobId, dispatch, token]);

    const statusHandler = async (status, id) => {
        try {
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status }, {
                withCredentials: true,
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            if (res.data.success) {
                toast.success(res.data.message);
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

    const allApplications = applicants?.applications || [];
    const totalPages = Math.ceil(allApplications.length / ITEMS_PER_PAGE);
    const paginatedApps = allApplications.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10 px-4'>
                <div className='flex items-center gap-4 justify-between border-b pb-4 mb-6'>
                    <BackButton to="/admin/jobs" label="Back to Jobs" />
                    <h1 className='font-bold text-xl text-gray-800'>
                        Applicants ({allApplications.length})
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
                                paginatedApps.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                            No applicants for this job yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedApps.map((app) => (
                                        <TableRow
                                            key={app._id}
                                            className="hover:bg-purple-50 transition duration-150 cursor-pointer"
                                            onClick={() => setSelectedApplicant(app)}
                                        >
                                            <TableCell className="font-semibold text-gray-800">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={app.applicant?.profile?.profilePhoto} />
                                                        <AvatarFallback className="bg-purple-100 text-purple-700 text-xs font-bold">
                                                            {app.applicant?.fullname?.charAt(0)?.toUpperCase() || "U"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="hover:text-[#6A38C2] hover:underline transition-colors">
                                                        {app.applicant?.fullname}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{app.applicant?.email}</TableCell>
                                            <TableCell>{app.applicant?.phoneNumber}</TableCell>
                                            <TableCell className="max-w-[160px] truncate">
                                                {app.applicant?.profile?.skills?.join(", ") || "N/A"}
                                            </TableCell>
                                            <TableCell onClick={(e) => e.stopPropagation()}>
                                                {
                                                    app.applicant?.profile?.resume ? (
                                                        <a href={`https://docs.google.com/viewer?url=${encodeURIComponent(app.applicant.profile.resume)}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 text-sm">
                                                            <FileText className="h-4 w-4" /> View PDF
                                                        </a>
                                                    ) : "No Resume"
                                                }
                                            </TableCell>
                                            <TableCell>{app.createdAt?.split("T")[0] || "N/A"}</TableCell>
                                            <TableCell className="text-right" onClick={e => e.stopPropagation()}>
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

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 px-1">
                        <p className="text-sm text-gray-500">
                            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, allApplications.length)} of {allApplications.length} applicants
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

            {/* Applicant Profile Modal */}
            {selectedApplicant && (
                <ApplicantProfileModal
                    app={selectedApplicant}
                    onClose={() => setSelectedApplicant(null)}
                />
            )}
        </div>
    )
}

export default Applicants
