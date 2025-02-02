import React from 'react';

const JobCard = ({ job }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md mb-4 bg-white">
      <h3 className="font-bold">{job.title}</h3>
      <p className="text-sm text-gray-500">{job.company} - {job.location}</p>
      <p className="mt-2">{job.description}</p>
      <button className="mt-2 bg-blue-500 text-white py-1 px-3 rounded">Apply</button>
    </div>
  );
};

export default JobCard;
