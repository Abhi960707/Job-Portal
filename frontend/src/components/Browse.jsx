import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useSelector } from 'react-redux';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { Input } from './ui/input';

const Browse = () => {
    useGetAllJobs(); // Ensure we fetch all jobs
    const { allJobs } = useSelector(store => store.job);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredJobs = allJobs?.filter(job => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return job.title?.toLowerCase().includes(query) ||
               job.company?.name?.toLowerCase().includes(query) ||
               job.location?.toLowerCase().includes(query) ||
               job.description?.toLowerCase().includes(query);
    }) || [];

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10 px-4'>
                <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8'>
                    <h1 className='font-bold text-2xl text-green-600'>Search Results ({filteredJobs.length})</h1>
                    <Input
                        type="text"
                        placeholder="Search by title, company, location, or description..."
                        className="max-w-md"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                {
                    filteredJobs.length === 0 ? (
                        <div className="text-center py-20 text-gray-500 font-semibold text-lg">
                            No jobs found matching your criteria.
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                            {
                                filteredJobs.map((job) => (
                                    <Job key={job._id} job={job} />
                                ))
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Browse