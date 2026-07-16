import React, { useState, useEffect } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job'
import { useSelector, useDispatch } from 'react-redux';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { setSearchJobByText } from '@/redux/jobSlice';

const Jobs = () => {
    useGetAllJobs(); 
    const dispatch = useDispatch();
    const { allJobs, searchJobByText } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);
    
    // Filter State
    const [activeFilters, setActiveFilters] = useState({
        Location: "",
        Industry: "",
        Salary: ""
    });

    const handleFilterChange = (filterType, value) => {
        setActiveFilters(prev => ({ ...prev, [filterType]: value === "All" ? "" : value }));
    };

    const clearFilters = () => {
        setActiveFilters({ Location: "", Industry: "", Salary: "" });
        dispatch(setSearchJobByText(""));
    };

    useEffect(() => {
        if (allJobs) {
            let filtered = [...allJobs];

            // 1. Text Search (Redux)
            if (searchJobByText) {
                const query = searchJobByText.toLowerCase();
                filtered = filtered.filter((job) => 
                    job?.title?.toLowerCase().includes(query) ||
                    job?.description?.toLowerCase().includes(query) ||
                    job?.location?.toLowerCase().includes(query) ||
                    job?.company?.name?.toLowerCase().includes(query)
                );
            }

            // 2. Location Filter
            if (activeFilters.Location) {
                filtered = filtered.filter(job => 
                    job?.location?.toLowerCase().includes(activeFilters.Location.toLowerCase())
                );
            }

            // 3. Industry (Title approximation for now, as DB only has title)
            if (activeFilters.Industry) {
                filtered = filtered.filter(job => 
                    job?.title?.toLowerCase().includes(activeFilters.Industry.toLowerCase().replace(" developer", "")) ||
                    job?.description?.toLowerCase().includes(activeFilters.Industry.toLowerCase())
                );
            }

            // 4. Salary Filter (approximated mapping)
            if (activeFilters.Salary) {
                filtered = filtered.filter(job => {
                    const sal = Number(job?.salary);
                    if (activeFilters.Salary === "0-25k") return sal < 3; 
                    if (activeFilters.Salary === "30-70k") return sal >= 3 && sal <= 7;
                    if (activeFilters.Salary === "1lakh to 2.5lakh") return sal > 7;
                    return true;
                });
            }

            setFilterJobs(filtered);
        }
    }, [allJobs, searchJobByText, activeFilters]);

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5 px-4'>
                <div className='flex gap-6 flex-col lg:flex-row'>
                    <div className='w-full lg:w-[22%]'>
                        <FilterCard 
                            activeFilters={activeFilters}
                            onFilterChange={handleFilterChange}
                            clearFilters={clearFilters}
                        />
                    </div>
                    {
                        filterJobs.length === 0 ? (
                            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center py-32">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">No jobs found</h2>
                                <p className="text-gray-500 mb-6">Try adjusting your filters or search query to find what you're looking for.</p>
                                <button 
                                    onClick={clearFilters}
                                    className="px-6 py-2 bg-[#6A38C2] text-white font-medium rounded-lg hover:bg-[#5d07f1] transition-colors"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5 pr-2 custom-scrollbar'>
                                <div className='mb-4'>
                                    <h1 className="text-xl font-bold text-gray-800">Showing {filterJobs.length} {filterJobs.length === 1 ? 'Job' : 'Jobs'}</h1>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
                                    {
                                        filterJobs.map((job) => (
                                            <div key={job?._id}>
                                                <Job job={job}/>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Jobs