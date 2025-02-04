import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchNotifications } from '../redux/slices/notificationSlice';
import useSocket from '../hooks/useSocket';

const NotificationList = ({ userId }) => {
  const dispatch = useAppDispatch();
  const { notifications, loading } = useAppSelector((state) => state.notifications);

  useSocket(userId); // Enable real-time notifications

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>

      {loading ? (
        <p>Loading notifications...</p>
      ) : notifications.length > 0 ? (
        notifications.map((notification) => (
          <div key={notification._id} className="p-2 border-b mb-2">
            <p>{notification.message}</p>
            <p className="text-sm text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
          </div>
        ))
      ) : (
        <p>No new notifications.</p>
      )}
    </div>
  );
};

export default NotificationList;
