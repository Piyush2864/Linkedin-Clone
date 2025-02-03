import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchProfile, fetchProfileAnalytics } from '../redux/slices/profileSlice';
import SkillsList from '../components/SkillsList';
import SkillSearchBar from '../components/SkillSearchBar';

const Profile = () => {
  const dispatch = useAppDispatch();
  const { profile, analytics, searchResults, loading } = useAppSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchProfileAnalytics());
  }, [dispatch]);

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">{profile.name}</h2>
      <p>{profile.headline}</p>

      
      <SkillSearchBar />
      <SkillsList skills={searchResults.length > 0 ? searchResults : profile.skills} />

      {/* Profile Analytics */}
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-bold">Profile Views</h3>
        <p>Last Week: <span className="font-semibold">{analytics.viewsLastWeek || 0}</span></p>
        <p>Last Month: <span className="font-semibold">{analytics.viewsLastMonth || 0}</span></p>
      </div>
    </div>
  );
};

export default Profile;
