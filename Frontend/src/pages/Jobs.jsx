import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchJobs } from '../redux/slices/jobSlice';
import JobFilters from '../components/JobFilters';
import JobCard from '../components/JobCard';

const Jobs = () => {
  const dispatch = useAppDispatch();
  const { filteredJobs, jobs, loading } = useAppSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const displayJobs = filteredJobs.length > 0 ? filteredJobs : jobs;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Find Your Dream Job</h2>
      <JobFilters />
      {loading ? <p>Loading jobs...</p> : displayJobs.map(job => <JobCard key={job.id} job={job} />)}
    </div>
  );
};

export default Jobs;
