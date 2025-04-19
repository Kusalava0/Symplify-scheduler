import React, { useEffect, useState } from 'react';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);

  
  const fetchNotifications = async () => {
    try {
      const res = await fetch('https://your-api.com/notifications');
      const data = await res.json();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };
  
  useEffect(() => {
    fetchNotifications();
  }, [notifications]);

  const handleCardClick = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Notifications</h2>
      <div className="space-y-4">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => handleCardClick(notif.id)}
            className={`cursor-pointer rounded-xl p-5 border transition-all shadow-sm hover:shadow-md
              ${notif.read
                ? 'bg-white border-gray-200'
                : 'bg-blue-50 border-blue-200'
              }`}
          >
            <h3 className="text-lg font-medium text-gray-900">{notif.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
            <p className="text-xs text-gray-400 mt-2">{notif.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
