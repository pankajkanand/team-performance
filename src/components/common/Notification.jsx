// components/common/Notification.js
import React from 'react';

const Notification = ({ notification }) => {
  if (!notification) return null;

  return (
    <div className={`mb-6 p-4 rounded-xl ${
      notification.type === 'error' 
        ? 'bg-red-100 border border-red-400 text-red-700' 
        : 'bg-green-100 border border-green-400 text-green-700'
    }`}>
      {notification.message}
    </div>
  );
};

export default Notification;