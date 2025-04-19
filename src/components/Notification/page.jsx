import React, { useEffect, useState } from 'react';
import { useToast } from "@/components/ui/use-toast"; // Adjust path as needed
import { useAuth } from '@/contexts/AuthContext'; // Assuming AuthContext is available

const NotificationPage = () => {
  const { user, authenticatedFetch } = useAuth();  // Get authenticatedFetch from AuthContext
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchNotifications = async () => {
    if (!user || !localStorage.getItem('accessToken')) {
      toast({ title: "Error", description: "User not logged in", variant: "destructive" });
      return;
    }
    try {
      const response = await authenticatedFetch(`${import.meta.env.VITE_BASE_URL}/api/notifications/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setNotifications(data.notifications || []);
      
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleCardClick = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  if (loading) {
    return <div>Loading notifications...</div>;
  }

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
            <p className="text-sm text-gray-600 mt-1">{notif.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
