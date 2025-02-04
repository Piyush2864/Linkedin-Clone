import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAppDispatch } from '../redux/hooks';
import { addNotification } from '../redux/slices/notificationSlice';

const useSocket = (userId) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const socket = io('http://localhost:8000'); // Change to your backend URL

    if (userId) {
      socket.emit('userOnline', userId);
    }

    socket.on('newNotification', (notification) => {
      dispatch(addNotification(notification));
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, dispatch]);
};

export default useSocket;
