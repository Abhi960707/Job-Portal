import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { LogOut, LayoutDashboard, Building2, Briefcase, Menu, X, Users, Search } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { USER_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { setUser, setToken } from '@/redux/authSlice'
import { setSearchJobByText } from '@/redux/jobSlice'
import { toast } from 'sonner'
import { Input } from '../ui/input'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                dispatch(setToken(null)); // Clear stored token on logout
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to logout");
        }
    }

    const getInitials = (name) => {
        if (!name) return "U";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }

    const searchHandler = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            dispatch(setSearchJobByText(searchQuery.trim()));
            navigate("/jobs");
        }
    }

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 mr-4">
                        <h1 className="text-2xl font-bold tracking-tight">
                            <span className="text-[#F83002]">Job</span>
                            <span className="text-[#6A38C2]">Portal</span>
                        </h1>
                    </Link>

                    {/* Search Bar (Desktop) */}
                    {(!user || user?.role !== 'recruiter') && (
                        <form onSubmit={searchHandler} className="hidden md:flex flex-1 max-w-sm mx-4">
                            <div className="relative w-full">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    type="text"
                                    placeholder="Search jobs..."
                                    className="w-full pl-9 bg-gray-50 border-gray-200 focus-visible:ring-[#6A38C2] rounded-full h-9"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </form>
                    )}

                    {/* Desktop Nav Links */}
                    <ul className="hidden md:flex font-medium items-center gap-6 text-gray-700 ml-auto">
                        {user && user.role === 'recruiter' ? (
                            <>
                                <li>
                                    <Link to="/admin/dashboard" className="flex items-center gap-1.5 hover:text-[#6A38C2] transition-colors duration-200">
                                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/companies" className="flex items-center gap-1.5 hover:text-[#6A38C2] transition-colors duration-200">
                                        <Building2 className="h-4 w-4" /> Companies
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/jobs" className="flex items-center gap-1.5 hover:text-[#6A38C2] transition-colors duration-200">
                                        <Briefcase className="h-4 w-4" /> Jobs
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/applicants" className="flex items-center gap-1.5 hover:text-[#6A38C2] transition-colors duration-200">
                                        <Users className="h-4 w-4" /> Applicants
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/" className="hover:text-[#6A38C2] transition-colors duration-200">Home</Link></li>
                                <li><Link to="/jobs" className="hover:text-[#6A38C2] transition-colors duration-200">Jobs</Link></li>
                                <li><Link to="/browse" className="hover:text-[#6A38C2] transition-colors duration-200">Browse</Link></li>
                            </>
                        )}
                    </ul>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4 ml-6 pl-6 border-l border-gray-200">
                        {!user ? (
                            <>
                                <Link to="/login">
                                    <Button variant="outline" className="border-[#6A38C2] text-[#6A38C2] hover:bg-[#6A38C2] hover:text-white transition-colors duration-200">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="bg-[#6A38C2] hover:bg-[#5d07f1] text-white transition-colors duration-200">
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/profile" className="flex items-center gap-3 cursor-pointer group">
                                    <Avatar className="h-10 w-10 border-2 border-[#6A38C2] group-hover:border-[#5d07f1] transition-colors duration-200">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                        <AvatarFallback className="bg-[#6A38C2] text-white text-sm font-semibold">
                                            {getInitials(user?.fullname)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <p className="text-sm font-semibold text-gray-800 leading-tight group-hover:text-[#6A38C2] transition-colors">{user?.fullname}</p>
                                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                                    </div>
                                </Link>
                                <Button
                                    onClick={logoutHandler}
                                    variant="outline"
                                    className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-600 flex items-center gap-2 transition-colors duration-200 font-medium rounded-xl h-10 px-4"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden flex items-center gap-2">
                        {(!user || user?.role !== 'recruiter') && (
                            <button onClick={() => navigate('/browse')} className="p-2 text-gray-600 hover:text-[#6A38C2]">
                                <Search className="h-5 w-5" />
                            </button>
                        )}
                        <button
                            className="p-2 text-gray-600 hover:text-[#6A38C2] transition-colors duration-200"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden border-t border-gray-100 py-4 space-y-1">
                        {user && user.role === 'recruiter' ? (
                            <>
                                <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-purple-50 hover:text-[#6A38C2] rounded-md text-sm font-medium">
                                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                                </Link>
                                <Link to="/admin/companies" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-purple-50 hover:text-[#6A38C2] rounded-md text-sm font-medium">
                                    <Building2 className="h-4 w-4" /> Companies
                                </Link>
                                <Link to="/admin/jobs" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-purple-50 hover:text-[#6A38C2] rounded-md text-sm font-medium">
                                    <Briefcase className="h-4 w-4" /> Jobs
                                </Link>
                                <Link to="/admin/applicants" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-purple-50 hover:text-[#6A38C2] rounded-md text-sm font-medium">
                                    <Users className="h-4 w-4" /> Applicants
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-purple-50 hover:text-[#6A38C2] rounded-md text-sm font-medium">Home</Link>
                                <Link to="/jobs" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-purple-50 hover:text-[#6A38C2] rounded-md text-sm font-medium">Jobs</Link>
                                <Link to="/browse" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-purple-50 hover:text-[#6A38C2] rounded-md text-sm font-medium">Browse</Link>
                            </>
                        )}
                        <div className="pt-4 border-t border-gray-100 mt-2">
                            {!user ? (
                                <div className="flex gap-2 px-4">
                                    <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                                        <Button variant="outline" className="w-full border-[#6A38C2] text-[#6A38C2]">Login</Button>
                                    </Link>
                                    <Link to="/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                                        <Button className="w-full bg-[#6A38C2] text-white">Sign Up</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="px-4 space-y-4">
                                    <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12 border-2 border-[#6A38C2]">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                            <AvatarFallback className="bg-[#6A38C2] text-white text-sm font-semibold">
                                                {getInitials(user?.fullname)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">{user?.fullname}</p>
                                            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                                        </div>
                                    </Link>
                                    <Button
                                        onClick={() => { logoutHandler(); setMobileOpen(false); }}
                                        variant="outline"
                                        className="w-full border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center justify-center gap-2 rounded-xl"
                                    >
                                        <LogOut className="h-4 w-4" /> Logout
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar