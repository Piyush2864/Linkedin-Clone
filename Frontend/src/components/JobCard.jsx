import React from 'react';
import { useAppDispatch } from '../redux/hooks';
import { applyForJob, saveJob } from '../redux/slices/jobSlice';

const JobCard = ({ job }) => {
  const dispatch = useAppDispatch();

  const handleApply = () => {
    dispatch(applyForJob(job.id));
  };

  const handleSave = () => {
    dispatch(saveJob(job.id));
  };

  return (
    <div className="border p-4 rounded-lg shadow-md mb-4 bg-white">
      <h3 className="font-bold">{job.title}</h3>
      <p className="text-sm text-gray-500">{job.company} - {job.location}</p>
      <p className="mt-2">{job.description}</p>
      
      <div className="flex justify-between mt-2">
        {/* Apply Button */}
        <button
          onClick={handleApply}
          className={`px-4 py-2 rounded ${
            job.applied ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
          disabled={job.applied}
        >
          {job.applied ? 'Applied' : 'Apply'}
        </button>
        
        {/* Save Job Button */}
        <button
          onClick={handleSave}
          className={`px-4 py-2 rounded ${
            job.saved ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-black hover:bg-gray-400'
          }`}
        >
          {job.saved ? 'Saved' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default JobCard;
