import React from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { logoutUser } from '../redux/slices/authSlice';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  return (
    <nav className="flex justify-between p-4 bg-white shadow-md">
      <h1 className="text-xl font-bold">LinkedIn Clone</h1>
      {user && (
        <div className="flex items-center gap-4">
          <p>{user.name}</p>
          <button
            onClick={() => dispatch(logoutUser())}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
