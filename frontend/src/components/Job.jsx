import React, { useState } from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const Job = ({ job }) => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  const calculateDaysAgo = (createdAt) => {
      if (!createdAt) return "N/A";
      const createdDate = new Date(createdAt);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate - createdDate);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return diffDays === 0 ? "Today" : diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
  };

  const getInitials = (name) => {
    if (!name) return "C";
    return name.substring(0, 2).toUpperCase();
  }

  return (
    <div className='p-5 m-2 rounded-xl shadow-sm bg-white border border-gray-100 flex flex-col justify-between h-full hover:shadow-lg transition-all duration-300'>
      <div>
        <div className='flex items-center justify-between'>
          <p className='text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md'>{calculateDaysAgo(job?.createdAt)}</p>
          <Button 
            onClick={() => setSaved(!saved)}
            variant="ghost" 
            className={`rounded-full p-2 h-auto hover:bg-purple-50 transition-colors ${saved ? 'text-[#6A38C2]' : 'text-gray-400'}`} 
            size="icon"
            aria-label="Save Job"
          >
              <Bookmark className={saved ? "fill-current h-5 w-5" : "h-5 w-5"} />
          </Button>
        </div>

        <div className='flex items-center gap-3 my-4'>
          <Avatar className="h-12 w-12 border border-gray-200">
            <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
            <AvatarFallback className="bg-[#6A38C2] text-white font-bold text-sm">
                {getInitials(job?.company?.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className='font-semibold text-lg text-gray-800 leading-tight'>{job?.company?.name}</h1>
            <p className='text-xs text-gray-500 mt-0.5'>{job?.location || "India"}</p>
          </div>
        </div>
        
        <div>
          <h1 className='font-bold text-xl my-2 text-gray-900'>{job?.title}</h1>
          <p className='text-sm text-gray-600 line-clamp-2 leading-relaxed'>
             {job?.description}
          </p>
        </div>
      </div>
      
      <div className="mt-5">
        <div className='flex items-center gap-2 flex-wrap mb-5'>
          <Badge className='text-blue-700 bg-blue-50 hover:bg-blue-100 border-none font-semibold px-3 py-1' variant="secondary">{job?.position} Positions</Badge>
          <Badge className='text-red-700 bg-red-50 hover:bg-red-100 border-none font-semibold px-3 py-1' variant="secondary">{job?.jobType}</Badge>
          <Badge className='text-purple-700 bg-purple-50 hover:bg-purple-100 border-none font-semibold px-3 py-1' variant="secondary">{job?.salary} LPA</Badge>
        </div>
        
        <div className='flex items-center gap-3'>
          <Button 
            onClick={() => navigate(`/description/${job?._id}`)} 
            variant='outline'
            className="flex-1 border-[#6A38C2] text-[#6A38C2] hover:bg-[#6A38C2] hover:text-white transition-colors"
          >
            Details
          </Button>
          <Button 
            onClick={() => setSaved(!saved)}
            className={`flex-1 transition-colors ${saved ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'bg-[#6A38C2] hover:bg-[#5d07f1] text-white'}`}
          >
            {saved ? "Saved" : "Save for Later"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Job