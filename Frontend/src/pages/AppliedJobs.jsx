import React from 'react';
import { useAppSelector } from '../redux/hooks';
import JobCard from '../components/JobCard';

const AppliedJobs = () => {
  const { jobs } = useAppSelector((state) => state.jobs);
  const appliedJobs = jobs.filter(job => job.applied);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Applied Jobs</h2>
      {appliedJobs.length === 0 ? <p>No jobs applied yet.</p> : appliedJobs.map(job => <JobCard key={job.id} job={job} />)}
    </div>
  );
};

export default AppliedJobs;
