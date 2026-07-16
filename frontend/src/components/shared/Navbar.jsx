import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { LogOut, User2, LayoutDashboard, Building2, Briefcase, Menu, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { USER_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to logout");
        }
    }

    // Get initials for avatar fallback
    const getInitials = (name) => {
        if (!name) return "U";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0">
                        <h1 className="text-2xl font-bold tracking-tight">
                            <span className="text-[#F83002]">Job</span>
                            <span className="text-[#6A38C2]">Portal</span>
                        </h1>
                    </Link>

                    {/* Desktop Nav Links */}
                    <ul className="hidden md:flex font-medium items-center gap-6 text-gray-700">
                        {user && user.role === 'recruiter' ? (
                            <>
                                <li>
                                    <Link
                                        to="/admin/dashboard"
                                        className="flex items-center gap-1.5 hover:text-[#6A38C2] transition-colors duration-200"
                                    >
                                        <LayoutDashboard className="h-4 w-4" />
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/admin/companies"
                                        className="flex items-center gap-1.5 hover:text-[#6A38C2] transition-colors duration-200"
                                    >
                                        <Building2 className="h-4 w-4" />
                                        Companies
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/admin/jobs"
                                        className="flex items-center gap-1.5 hover:text-[#6A38C2] transition-colors duration-200"
                                    >
                                        <Briefcase className="h-4 w-4" />
                                        Jobs
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
                    <div className="hidden md:flex items-center gap-3">
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
                        ) : user.role === 'recruiter' ? (
                            /* Recruiter: Show avatar + visible logout button */
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-9 w-9 border-2 border-[#6A38C2]">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                        <AvatarFallback className="bg-[#6A38C2] text-white text-sm font-semibold">
                                            {getInitials(user?.fullname)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="hidden lg:block">
                                        <p className="text-sm font-semibold text-gray-800 leading-tight">{user?.fullname}</p>
                                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={logoutHandler}
                                    variant="outline"
                                    size="sm"
                                    className="border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 flex items-center gap-2 transition-colors duration-200 font-medium"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            /* Student: Avatar popover */
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button className="focus:outline-none focus:ring-2 focus:ring-[#6A38C2] rounded-full">
                                        <Avatar className="h-9 w-9 cursor-pointer border-2 border-[#6A38C2] hover:border-[#5d07f1] transition-colors duration-200">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                            <AvatarFallback className="bg-[#6A38C2] text-white text-sm font-semibold">
                                                {getInitials(user?.fullname)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-72 p-0 shadow-lg border border-gray-100" align="end">
                                    {/* Header */}
                                    <div className="flex gap-3 p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
                                        <Avatar className="h-12 w-12 border-2 border-[#6A38C2]">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                            <AvatarFallback className="bg-[#6A38C2] text-white font-semibold">
                                                {getInitials(user?.fullname)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">{user?.fullname}</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                                            <span className="inline-block text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full mt-1 font-medium capitalize">
                                                {user?.role}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Bio */}
                                    {user?.profile?.bio && (
                                        <div className="px-4 py-2 border-b border-gray-50">
                                            <p className="text-xs text-gray-500 italic">{user.profile.bio}</p>
                                        </div>
                                    )}
                                    {/* Actions */}
                                    <div className="p-2">
                                        <Link to="/profile">
                                            <button className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-[#6A38C2] rounded-md transition-colors duration-150 font-medium">
                                                <User2 className="h-4 w-4" />
                                                View Profile
                                            </button>
                                        </Link>
                                        <button
                                            onClick={logoutHandler}
                                            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150 font-medium mt-1"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Logout
                                        </button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-gray-600 hover:text-[#6A38C2] transition-colors duration-200"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
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
                            </>
                        ) : (
                            <>
                                <Link to="/" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-purple-50 hover:text-[#6A38C2] rounded-md text-sm font-medium">Home</Link>
                                <Link to="/jobs" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-purple-50 hover:text-[#6A38C2] rounded-md text-sm font-medium">Jobs</Link>
                                <Link to="/browse" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-purple-50 hover:text-[#6A38C2] rounded-md text-sm font-medium">Browse</Link>
                            </>
                        )}
                        <div className="pt-2 border-t border-gray-100 mt-2">
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
                                <div className="px-4 space-y-2">
                                    {user.role === 'student' && (
                                        <Link to="/profile" onClick={() => setMobileOpen(false)}>
                                            <button className="flex w-full items-center gap-2 py-2.5 text-sm text-gray-700 font-medium">
                                                <User2 className="h-4 w-4" /> View Profile
                                            </button>
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => { logoutHandler(); setMobileOpen(false); }}
                                        className="flex w-full items-center gap-2 py-2.5 text-sm text-red-600 font-medium"
                                    >
                                        <LogOut className="h-4 w-4" /> Logout
                                    </button>
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