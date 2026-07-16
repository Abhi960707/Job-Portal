import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Edit2, Plus, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetCompany from '@/hooks/useGetCompany'

const Companies = () => {
    useGetCompany();
    const navigate = useNavigate();
    const { companies } = useSelector(store => store.company);
    const [filterText, setFilterText] = useState("");
    const [filteredCompanies, setFilteredCompanies] = useState([]);

    useEffect(() => {
        if (companies) {
            const filtered = companies.filter(company => 
                company.name?.toLowerCase().includes(filterText.toLowerCase())
            );
            setFilteredCompanies(filtered);
        }
    }, [companies, filterText]);

    return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10 px-4'>
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
                                <TableHead className="w-[100px]">Logo</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Website</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Created Date</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                filteredCompanies.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                            No companies found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredCompanies.map((company) => (
                                        <TableRow key={company._id} className="hover:bg-gray-50 transition duration-150">
                                            <TableCell>
                                                <Avatar className="h-10 w-10 border">
                                                    <AvatarImage src={company.logo} alt={company.name} />
                                                </Avatar>
                                            </TableCell>
                                            <TableCell className="font-semibold text-gray-800">{company.name}</TableCell>
                                            <TableCell>
                                                {company.website ? (
                                                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                        {company.website}
                                                    </a>
                                                ) : "N/A"}
                                            </TableCell>
                                            <TableCell>{company.location || "N/A"}</TableCell>
                                            <TableCell>{company.createdAt?.split("T")[0] || "N/A"}</TableCell>
                                            <TableCell className="text-right">
                                                <Button onClick={() => navigate(`/admin/companies/${company._id}`)} variant="ghost" size="icon" className="hover:bg-gray-100 rounded-full">
                                                    <Edit2 className="h-4 w-4 text-gray-600" />
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

export default Companies
