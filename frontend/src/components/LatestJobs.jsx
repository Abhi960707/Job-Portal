import React from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';
import { Briefcase } from 'lucide-react';

const LatestJobs = () => {
    const { allJobs } = useSelector(store => store.job);

    return (
        <div className='max-w-7xl mx-auto my-20 px-4'>
            <h1 className='text-4xl font-bold text-center mb-10'>
                <span className='text-[#6A38C2]'>Latest & Top</span> Job Openings
            </h1>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-5'>
                {
                    allJobs.length <= 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                            <Briefcase className="h-12 w-12 text-gray-400 mb-4" />
                            <h2 className="text-xl font-bold text-gray-700">No Jobs Available Right Now</h2>
                            <p className="text-gray-500 mt-2">Check back later for new opportunities!</p>
                        </div>
                    ) : (
                        allJobs.slice(0, 6).map((job) => <LatestJobCards key={job._id} job={job} />)
                    )
                }
            </div>
        </div>
    )
}

export default LatestJobs