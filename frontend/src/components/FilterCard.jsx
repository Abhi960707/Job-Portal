import React from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { Button } from './ui/button'

const filterData = [
  {
    filterType: "Location",
    array: ["Pune", "Mumbai", "Delhi", "Banglore", "Noida", "All"]
  },
  {
    filterType: "Industry",
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer", "All"]
  },
  {
    filterType: "Salary",
    array: ["0-25k", "30-70k", "1lakh to 2.5lakh", "All"]
  },
]

const FilterCard = ({ activeFilters, onFilterChange, clearFilters }) => {
  return (
    <div className='w-full bg-white p-5 rounded-xl shadow-sm border border-gray-100'>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='font-bold text-lg text-gray-800'>Filter Jobs</h1>
        <Button 
            onClick={clearFilters}
            variant="ghost" 
            size="sm" 
            className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
        >
            Reset
        </Button>
      </div>
      <hr className='mb-4 border-gray-200' />
      
      <div className="space-y-6">
        {filterData.map((data, index) => (
            <div key={index} className="space-y-3">
              <h1 className='font-semibold text-md text-gray-700'>{data.filterType}</h1>
              <RadioGroup 
                value={activeFilters[data.filterType] || ""}
                onValueChange={(value) => onFilterChange(data.filterType, value)}
              >
                {data.array.map((item, idx) => {
                  const itemId = `id-${index}-${idx}`;
                  return (
                    <div className='flex items-center space-x-3 mb-2' key={itemId}>
                      <RadioGroupItem value={item} id={itemId} className="text-[#6A38C2] border-gray-300" />
                      <Label htmlFor={itemId} className="text-gray-600 font-normal cursor-pointer">{item}</Label>
                    </div>
                  )
                })}
              </RadioGroup>
            </div>
        ))}
      </div>
    </div>
  )
}

export default FilterCard