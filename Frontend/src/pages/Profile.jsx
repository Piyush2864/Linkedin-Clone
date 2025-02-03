import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchProfile } from '../redux/slices/profileSlice';
import SkillsList from '../components/SkillsList';
import SkillSearchBar from '../components/SkillSearchBar';

const Profile = () => {
  const dispatch = useAppDispatch();
  const { profile, searchResults, loading } = useAppSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfile());  // Fetch user profile
  }, [dispatch]);

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">{profile.name}</h2>
      <p>{profile.headline}</p>

      
      <SkillSearchBar />

      
      <SkillsList skills={searchResults.length > 0 ? searchResults : profile.skills} />
    </div>
  );
};

export default Profile;
