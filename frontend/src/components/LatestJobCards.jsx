import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();

    const getInitials = (name) => {
        if (!name) return "C";
        return name.substring(0, 2).toUpperCase();
    }

    return (
        <div onClick={() => navigate(`/description/${job?._id}`)} className='p-6 rounded-2xl shadow-sm bg-white border border-gray-100 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group'>
            <div className="flex items-center gap-3 mb-4">
                 <Avatar className="h-10 w-10 border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                    <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
                    <AvatarFallback className="bg-gradient-to-br from-[#6A38C2] to-[#9b55e5] text-white font-bold text-xs">
                        {getInitials(job?.company?.name)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h1 className='font-semibold text-md text-gray-800 leading-tight group-hover:text-[#6A38C2] transition-colors'>{job?.company?.name}</h1>
                    <p className='text-xs text-gray-500 mt-0.5'>{job?.location || "India"}</p>
                </div>
            </div>
            
            <div className="flex-1">
                <h1 className='font-bold text-xl my-2 text-gray-900 leading-tight'>{job?.title}</h1>
                <p className='text-sm text-gray-600 line-clamp-2 leading-relaxed'>{job?.description}</p>
            </div>
            
            <div className='flex items-center gap-2 mt-5 flex-wrap'>
                <Badge className='text-blue-700 bg-blue-50 border-none font-semibold hover:bg-blue-100 transition-colors' variant="secondary">{job?.position} Positions</Badge>
                <Badge className='text-red-700 bg-red-50 border-none font-semibold hover:bg-red-100 transition-colors' variant="secondary">{job?.jobType}</Badge>
                <Badge className='text-purple-700 bg-purple-50 border-none font-semibold hover:bg-purple-100 transition-colors' variant="secondary">{job?.salary} LPA</Badge>
            </div>
        </div>
    )
}

export default LatestJobCards