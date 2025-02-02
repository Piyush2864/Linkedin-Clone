import React from 'react';
import { useAppSelector } from '../redux/hooks';

const Sidebar = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="border p-4 rounded-lg shadow-md bg-white">
      <h3 className="font-bold">Welcome, {user.name}!</h3>
      <p className="text-sm text-gray-500">{user.headline}</p>
      <div className="mt-4">
        <h4 className="font-semibold">People You May Know</h4>
        <p className="text-sm text-blue-500">[Connection suggestions will go here]</p>
      </div>
    </div>
  );
};

export default Sidebar;
