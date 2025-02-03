import React from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addEndorsement, removeEndorsement } from '../redux/slices/profileSlice';

const SkillsList = ({ skills }) => {
  const dispatch = useAppDispatch();
  const { endorsements } = useAppSelector((state) => state.profile);

  const handleEndorse = (skill) => {
    dispatch(addEndorsement({ userId: 123, skill }));  // Replace 123 with actual user ID
  };

  const handleRemoveEndorsement = (skill) => {
    dispatch(removeEndorsement({ userId: 123, skill }));  // Replace 123 with actual user ID
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Skills</h3>
      {skills.map((skill) => {
        const isEndorsed = endorsements.some((endorse) => endorse.skill === skill);
        return (
          <div key={skill} className="flex justify-between items-center mb-2">
            <p>{skill}</p>
            {isEndorsed ? (
              <button onClick={() => handleRemoveEndorsement(skill)} className="text-red-500">
                Remove Endorsement
              </button>
            ) : (
              <button onClick={() => handleEndorse(skill)} className="text-blue-500">
                Endorse
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SkillsList;
