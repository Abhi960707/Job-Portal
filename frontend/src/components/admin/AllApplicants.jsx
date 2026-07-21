import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import BackButton from '../shared/BackButton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import {
    MoreHorizontal, Check, X, FileText, ChevronLeft, ChevronRight,
    User, Mail, Phone, Briefcase, X as CloseIcon, Search, Users
} from 'lucide-react'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'

const ITEMS_PER_PAGE = 10;

// ─── Profile Modal ────────────────────────────────────────────────────────────
const ApplicantProfileModal = ({ app, onClose }) => {
    if (!app) return null;
    const applicant = app.applicant;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative animate-fadeIn" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition">
                    <CloseIcon className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-4 mb-5">
                    <Avatar className="h-16 w-16 border-2 border-purple-200">
                        <AvatarImage src={applicant?.profile?.profilePhoto} />
                        <AvatarFallback className="bg-gradient-to-br from-[#6A38C2] to-[#9b55e5] text-white text-xl font-bold">
                            {applicant?.fullname?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="font-bold text-xl text-gray-900">{applicant?.fullname}</h2>
                        <p className="text-sm text-gray-500 mt-0.5">{app.job?.title} @ {app.job?.company?.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border uppercase mt-1 inline-block ${
                            app.status === 'accepted' ? 'text-green-700 bg-green-50 border-green-200' :
                            app.status === 'rejected' ? 'text-red-700 bg-red-50 border-red-200' :
                            'text-yellow-700 bg-yellow-50 border-yellow-200'
                        }`}>{app.status}</span>
                    </div>
                </div>
                <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-gray-700">
                        <div className="bg-purple-50 p-2 rounded-full"><Mail className="h-4 w-4 text-purple-600" /></div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Email</p>
                            <p className="font-semibold">{applicant?.email || "N/A"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                        <div className="bg-purple-50 p-2 rounded-full"><Phone className="h-4 w-4 text-purple-600" /></div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Phone</p>
                            <p className="font-semibold">{applicant?.phoneNumber || "N/A"}</p>
                        </div>
                    </div>
                    {applicant?.profile?.bio && (
                        <div className="flex items-start gap-3 text-gray-700">
                            <div className="bg-purple-50 p-2 rounded-full mt-0.5"><User className="h-4 w-4 text-purple-600" /></div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium">Bio</p>
                                <p className="font-medium">{applicant.profile.bio}</p>
                            </div>
                        </div>
                    )}
                    <div className="flex items-start gap-3 text-gray-700">
                        <div className="bg-purple-50 p-2 rounded-full mt-0.5"><Briefcase className="h-4 w-4 text-purple-600" /></div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Skills</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {applicant?.profile?.skills?.length ? (
                                    applicant.profile.skills.map((skill, i) => (
                                        <Badge key={i} className="bg-gray-800 text-white text-xs px-2 py-0.5">{skill}</Badge>
                                    ))
                                ) : <span className="text-gray-400 italic text-xs">No skills listed</span>}
                            </div>
                        </div>
                    </div>
                    {applicant?.profile?.resume && (
                        <div className="pt-3 border-t border-gray-100">
                            <a href={`https://docs.google.com/viewer?url=${encodeURIComponent(applicant.profile.resume)}`} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-2 text-[#6A38C2] font-semibold hover:underline">
                                <FileText className="h-4 w-4" />
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

// ─── Main Component ───────────────────────────────────────────────────────────
const AllApplicants = () => {
    const [applications, setApplications] = useState([]);
    const [filtered, setFiltered]         = useState([]);
    const [search, setSearch]             = useState("");
    const [currentPage, setCurrentPage]   = useState(1);
    const [selectedApp, setSelectedApp]   = useState(null);
    const [loading, setLoading]           = useState(true);
    const { token }                       = useSelector(store => store.auth);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/all`, {
                    withCredentials: true,
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                if (res.data.success) {
                    setApplications(res.data.applications);
                    setFiltered(res.data.applications);
                }
            } catch (e) {
                toast.error("Failed to load applicants");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [token]);

    // Search filter
    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(
            applications.filter(app =>
                app.applicant?.fullname?.toLowerCase().includes(q) ||
                app.applicant?.email?.toLowerCase().includes(q) ||
                app.job?.title?.toLowerCase().includes(q) ||
                app.job?.company?.name?.toLowerCase().includes(q) ||
                app.status?.toLowerCase().includes(q)
            )
        );
        setCurrentPage(1);
    }, [search, applications]);

    const statusHandler = async (status, id) => {
        try {
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status }, {
                withCredentials: true,
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            if (res.data.success) {
                toast.success(res.data.message);
                setApplications(prev => prev.map(a => a._id === id ? { ...a, status: status.toLowerCase() } : a));
            }
        } catch (e) {
            toast.error(e.response?.data?.message || "Failed to update status");
        }
    };

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto my-10 px-4">

                {/* Header */}
                <div className="flex items-center gap-4 justify-between flex-wrap border-b pb-4 mb-6">
                    <div className="flex items-center gap-3">
                        <BackButton to="/admin/dashboard" label="Back to Dashboard" />
                        <div>
                            <h1 className="font-bold text-2xl text-gray-900 flex items-center gap-2">
                                <Users className="h-6 w-6 text-[#6A38C2]" />
                                All Applicants
                            </h1>
                            <p className="text-sm text-gray-500 mt-0.5">All candidates who applied across your posted jobs</p>
                        </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-600 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-full">
                        {filtered.length} total
                    </span>
                </div>

                {/* Search Bar */}
                <div className="mb-4 flex items-center gap-2 max-w-sm bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                    <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <input
                        type="text"
                        placeholder="Search by name, job, company, status..."
                        className="outline-none border-none w-full text-sm text-gray-700 bg-transparent"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {/* Table */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead>Applicant</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Job Applied</TableHead>
                                <TableHead>Company</TableHead>
                                <TableHead>Resume</TableHead>
                                <TableHead>Applied Date</TableHead>
                                <TableHead className="text-right">Status / Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-12 text-gray-400">
                                        Loading applicants...
                                    </TableCell>
                                </TableRow>
                            ) : paginated.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-12 text-gray-400">
                                        No applicants found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginated.map(app => (
                                    <TableRow
                                        key={app._id}
                                        className="hover:bg-purple-50 cursor-pointer transition duration-150"
                                        onClick={() => setSelectedApp(app)}
                                    >
                                        {/* Applicant name + avatar */}
                                        <TableCell className="font-semibold text-gray-800">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={app.applicant?.profile?.profilePhoto} />
                                                    <AvatarFallback className="bg-purple-100 text-purple-700 text-xs font-bold">
                                                        {app.applicant?.fullname?.charAt(0)?.toUpperCase() || "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="hover:text-[#6A38C2] transition-colors">{app.applicant?.fullname}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">{app.applicant?.email}</TableCell>
                                        <TableCell className="text-sm">{app.applicant?.phoneNumber || "N/A"}</TableCell>
                                        <TableCell className="font-medium text-[#6A38C2]">{app.job?.title || "N/A"}</TableCell>
                                        <TableCell className="text-sm text-gray-600">{app.job?.company?.name || "N/A"}</TableCell>
                                        <TableCell onClick={e => e.stopPropagation()}>
                                            {app.applicant?.profile?.resume ? (
                                                <a href={`https://docs.google.com/viewer?url=${encodeURIComponent(app.applicant.profile.resume)}`} target="_blank" rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline flex items-center gap-1 text-sm">
                                                    <FileText className="h-4 w-4" /> View PDF
                                                </a>
                                            ) : <span className="text-gray-400 text-xs">No Resume</span>}
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-500">{app.createdAt?.split("T")[0] || "N/A"}</TableCell>
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
                                                            <button onClick={() => statusHandler("accepted", app._id)} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-green-700 hover:bg-green-50 rounded-md font-medium">
                                                                <Check className="h-4 w-4" /> Accept
                                                            </button>
                                                            <button onClick={() => statusHandler("rejected", app._id)} className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-red-700 hover:bg-red-50 rounded-md font-medium">
                                                                <X className="h-4 w-4" /> Reject
                                                            </button>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 px-1">
                        <p className="text-sm text-gray-500">
                            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
                        </p>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="flex items-center gap-1">
                                <ChevronLeft className="h-4 w-4" /> Prev
                            </Button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <Button key={page} variant={currentPage === page ? "default" : "outline"} size="sm"
                                    onClick={() => setCurrentPage(page)}
                                    className={currentPage === page ? "bg-[#6A38C2] text-white hover:bg-[#5d07f1]" : ""}>
                                    {page}
                                </Button>
                            ))}
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1">
                                Next <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Profile Modal */}
            {selectedApp && <ApplicantProfileModal app={selectedApp} onClose={() => setSelectedApp(null)} />}
        </div>
    );
};

export default AllApplicants;
