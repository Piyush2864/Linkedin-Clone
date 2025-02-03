import React, { useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { fetchFilteredJobs } from '../redux/slices/jobSlice';

const JobFilters = ({ filteredJobs, setFilteredJobs }) => {
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState({
    location: '',
    minSalary: '',
    remote: '',
    experience: '',
  });

  const [sortOption, setSortOption] = useState('');

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
};


  const applyFilters = () => {
    dispatch(fetchFilteredJobs(filters));
  };

  const applySorting = () => {
    const sortedJobs = [...filteredJobs].sort((a, b) => {
      if (sortOption === 'salary') return b.salary - a.salary;
      if (sortOption === 'date') return new Date(b.postedAt) - new Date(a.postedAt);
      if (sortOption === 'company') return a.company.localeCompare(b.company);
      return 0;
    });
    setFilteredJobs(sortedJobs);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg mb-4">
      <h3 className="font-bold mb-2">Filters</h3>
      <div className="grid grid-cols-2 gap-4">
        <input type="text" name="location" placeholder="Location" value={filters.location} onChange={handleChange} className="border p-2 rounded" />
        <input type="number" name="minSalary" placeholder="Min Salary" value={filters.minSalary} onChange={handleChange} className="border p-2 rounded" />
        <select name="remote" value={filters.remote} onChange={handleChange} className="border p-2 rounded">
          <option value="">All</option>
          <option value="true">Remote</option>
          <option value="false">On-Site</option>
        </select>
        <select name="experience" value={filters.experience} onChange={handleChange} className="border p-2 rounded">
          <option value="">All</option>
          <option value="Entry">Entry</option>
          <option value="Mid">Mid</option>
          <option value="Senior">Senior</option>
        </select>
      </div>
      
      {/* Sorting Dropdown */}
      <div className="mt-2">
        <select name="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="border p-2 rounded w-full">
          <option value="">Sort By</option>
          <option value="salary">Salary</option>
          <option value="date">Date Posted</option>
          <option value="company">Company</option>
        </select>
      </div>

      {/* Apply Filters & Sorting Buttons */}
      <div className="flex gap-2 mt-2">
        <button onClick={applyFilters} className="bg-blue-500 text-white px-4 py-2 rounded w-full">
          Apply Filters
        </button>
        <button onClick={applySorting} className="bg-gray-500 text-white px-4 py-2 rounded w-full">
          Sort
        </button>
      </div>
    </div>
  );
};

export default JobFilters;
