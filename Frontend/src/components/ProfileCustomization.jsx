import React, { useState } from 'react';
import axios from 'axios';

const ProfileCustomization = ({ user }) => {
  const [bio, setBio] = useState(user.bio || '');
  const [headline, setHeadline] = useState(user.headline || '');
  const [profilePicture, setProfilePicture] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('bio', bio);
    formData.append('headline', headline);
    if (profilePicture) formData.append('profilePicture', profilePicture);
    if (coverPhoto) formData.append('coverPhoto', coverPhoto);

    try {
      await axios.put('/api/v1/profile/update', formData, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Profile updated successfully');
    } catch (error) {
      alert('Error updating profile');
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Customize Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label>Headline</label>
          <input type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} className="w-full p-2 border rounded" />
        </div>

        <div className="mb-4">
          <label>Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-2 border rounded" rows="3"></textarea>
        </div>

        <div className="mb-4">
          <label>Profile Picture</label>
          <input type="file" onChange={(e) => setProfilePicture(e.target.files[0])} />
        </div>

        <div className="mb-4">
          <label>Cover Photo</label>
          <input type="file" onChange={(e) => setCoverPhoto(e.target.files[0])} />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save Changes</button>
      </form>
    </div>
  );
};

export default ProfileCustomization;
