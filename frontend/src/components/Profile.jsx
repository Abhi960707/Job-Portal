import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, FileText } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'

const Profile = () => {
    // Fetch applied jobs directly in the profile page so it's always up to date
    useGetAppliedJobs();
    
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const isResume = !!user?.profile?.resume;

    const getInitials = (name) => {
        if (!name) return "U";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-10">
            <Navbar />
            
            {/* Profile Card */}
            <div className='max-w-4xl mx-auto bg-white border border-gray-100 rounded-2xl shadow-sm mt-10 p-8'>
                <div className='flex justify-between items-start'>
                    <div className='flex items-center gap-6'>
                        <Avatar className="h-28 w-28 border-4 border-white shadow-md">
                            <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} className="object-cover" />
                            <AvatarFallback className="bg-gradient-to-br from-[#6A38C2] to-[#9b55e5] text-white text-3xl font-bold">
                                {getInitials(user?.fullname)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className='font-bold text-2xl text-gray-900'>{user?.fullname}</h1>
                                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-none capitalize">{user?.role}</Badge>
                            </div>
                            <p className="text-gray-600 mt-2 max-w-md">
                                {user?.profile?.bio || "Passionate professional looking for new opportunities. Add a bio to tell recruiters more about yourself."}
                            </p>
                        </div>
                    </div>
                    <Button 
                        onClick={() => setOpen(true)} 
                        className='text-right border-[#6A38C2] text-[#6A38C2] hover:bg-[#6A38C2] hover:text-white transition-colors' 
                        variant='outline'
                    >
                        <Pen className="h-4 w-4 mr-2" /> Edit
                    </Button>
                </div>
                
                <div className='mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100'>
                    <div className='flex gap-4 items-center text-gray-700'>
                        <div className="bg-white p-3 rounded-full shadow-sm">
                            <Mail className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Email Address</p>
                            <span className="font-semibold">{user?.email}</span>
                        </div>
                    </div>
                    <div className='flex gap-4 items-center text-gray-700'>
                        <div className="bg-white p-3 rounded-full shadow-sm">
                            <Contact className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Phone Number</p>
                            <span className="font-semibold">+91 {user?.phoneNumber}</span>
                        </div>
                    </div>
                </div>

                <div className='mt-8'>
                    <h2 className='font-bold text-lg text-gray-800 mb-4'>Skills</h2>
                    <div className='flex items-center gap-2 flex-wrap'>
                        {
                            user?.profile?.skills && user?.profile?.skills.length !== 0 
                            ? user?.profile?.skills.map((item, index) => (
                                <Badge key={index} className="bg-gray-800 text-white hover:bg-gray-700 px-3 py-1 font-medium text-sm">
                                    {item}
                                </Badge>
                            )) 
                            : <span className="text-gray-500 italic text-sm bg-gray-50 px-4 py-2 rounded-md border border-gray-100">No skills added yet.</span>
                        }
                    </div>
                </div>

                <div className='mt-8 pt-8 border-t border-gray-100 grid w-full max-w-sm items-center gap-2'>
                    <Label className="text-md font-bold text-gray-800">Resume</Label>
                    {
                        isResume ? (
                            <a 
                                target='_blank' 
                                rel="noreferrer"
                                href={user?.profile?.resume} 
                                className='flex items-center gap-2 text-[#6A38C2] font-semibold hover:underline cursor-pointer group'
                            >
                                <FileText className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                {user?.profile?.resumeOriginalName || "View Resume"}
                            </a>
                        ) : (
                            <span className="text-gray-500 italic text-sm">No resume uploaded.</span>
                        )
                    }
                </div>
            </div>

            {/* Applied Jobs Section */}
            <div className='max-w-4xl mx-auto bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mt-8'>
                <h2 className='font-bold text-xl text-gray-900 mb-6'>Applied Jobs History</h2>
                <AppliedJobTable />
            </div>

            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile