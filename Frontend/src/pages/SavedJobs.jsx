import React from 'react';
import { useAppSelector } from '../redux/hooks';
import JobCard from '../components/JobCard';

const SavedJobs = () => {
  const { jobs } = useAppSelector((state) => state.jobs);
  const savedJobs = jobs.filter(job => job.saved);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Saved Jobs</h2>
      {savedJobs.length === 0 ? <p>No saved jobs yet.</p> : savedJobs.map(job => <JobCard key={job.id} job={job} />)}
    </div>
  );
};

export default SavedJobs;
