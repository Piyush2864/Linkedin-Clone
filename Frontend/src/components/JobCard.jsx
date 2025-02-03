import React from 'react';
import { useAppDispatch } from '../redux/hooks';
import { applyForJob } from '../redux/slices/jobSlice';

const JobCard = ({ job }) => {
  const dispatch = useAppDispatch();

  const handleApply = () => {
    dispatch(applyForJob(job.id));
  };

  return (
    <div className="border p-4 rounded-lg shadow-md mb-4 bg-white">
      <h3 className="font-bold">{job.title}</h3>
      <p className="text-sm text-gray-500">{job.company} - {job.location}</p>
      <p className="mt-2">{job.description}</p>
      
      <button
        onClick={handleApply}
        className={`mt-2 px-4 py-2 rounded ${
          job.applied ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
        disabled={job.applied}
      >
        {job.applied ? 'Applied' : 'Apply'}
      </button>
    </div>
  );
};

export default JobCard;
