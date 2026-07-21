import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Edit2, Plus, Search, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import useGetCompany from '@/hooks/useGetCompany'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { setCompanies } from '@/redux/companySlice'
import { toast } from 'sonner'
import BackButton from '../shared/BackButton'

const ITEMS_PER_PAGE = 10;

const Companies = () => {
    useGetCompany();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { companies } = useSelector(store => store.company);
    const { token } = useSelector(store => store.auth);
    const [filterText, setFilterText] = useState("");
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        if (companies) {
            const filtered = companies.filter(company =>
                company.name?.toLowerCase().includes(filterText.toLowerCase())
            );
            setFilteredCompanies(filtered);
            setCurrentPage(1);
        }
    }, [companies, filterText]);

    const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE);
    const paginatedCompanies = filteredCompanies.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleDelete = async (companyId, companyName) => {
        if (!window.confirm(`Are you sure you want to delete "${companyName}"? This action cannot be undone.`)) return;
        try {
            setDeletingId(companyId);
            const res = await axios.delete(`${COMPANY_API_END_POINT}/delete/${companyId}`, {
                withCredentials: true,
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(setCompanies(companies.filter(c => c._id !== companyId)));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete company");
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
                            placeholder="Filter by name..."
                            className='outline-none border-none w-full py-1 text-sm'
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => navigate("/admin/companies/create")} className="bg-[#6A38C2] hover:bg-[#5d07f1] text-white flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Register New Company
                    </Button>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Logo</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Website</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Created Date</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                paginatedCompanies.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                            No companies found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedCompanies.map((company) => (
                                        <TableRow key={company._id} className="hover:bg-gray-50 transition duration-150">
                                            <TableCell>
                                                <Avatar className="h-10 w-10 border">
                                                    <AvatarImage src={company.logo} alt={company.name} />
                                                    <AvatarFallback className="bg-purple-100 text-purple-700 font-bold text-sm">
                                                        {company.name?.charAt(0)?.toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </TableCell>
                                            <TableCell className="font-semibold text-gray-800">{company.name}</TableCell>
                                            <TableCell>
                                                {company.website ? (
                                                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                                        {company.website}
                                                    </a>
                                                ) : "N/A"}
                                            </TableCell>
                                            <TableCell>{company.location || "N/A"}</TableCell>
                                            <TableCell>{company.createdAt?.split("T")[0] || "N/A"}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        onClick={() => navigate(`/admin/companies/${company._id}`)}
                                                        variant="ghost"
                                                        size="icon"
                                                        className="hover:bg-blue-50 rounded-full"
                                                        title="Edit Company"
                                                    >
                                                        <Edit2 className="h-4 w-4 text-blue-600" />
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDelete(company._id, company.name)}
                                                        variant="ghost"
                                                        size="icon"
                                                        className="hover:bg-red-50 rounded-full"
                                                        title="Delete Company"
                                                        disabled={deletingId === company._id}
                                                    >
                                                        <Trash2 className={`h-4 w-4 ${deletingId === company._id ? 'text-gray-300' : 'text-red-500'}`} />
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
                            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredCompanies.length)} of {filteredCompanies.length} companies
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

export default Companies
