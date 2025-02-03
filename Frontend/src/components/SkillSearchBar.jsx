import React, { useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { searchSkills } from '../redux/slices/profileSlice';

const SkillSearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useAppDispatch();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    dispatch(searchSkills(e.target.value));  
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search skills..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full p-2 border rounded"
      />
    </div>
  );
};

export default SkillSearchBar;
