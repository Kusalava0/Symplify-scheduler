import React, { useEffect, useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import Pagination from '@/components/Pagination';
import { useNavigate, useParams } from 'react-router-dom';

const NotificationPage = () => {
  const { user, authenticatedFetch } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const postPerPage = 10;
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    if (!user || !localStorage.getItem('accessToken')) {
      toast({ title: "Error", description: "User not logged in", variant: "destructive" });
      setLoading(false);
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
      console.log(data)
      setNotifications(data.results || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const lastIndex = currentPage * postPerPage;
  const firstIndex = lastIndex - postPerPage;
  const currentPosts = notifications.slice(firstIndex, lastIndex);
  const lengthN = notifications.length

  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      setLoading(false);
    }
  }, [user]);   

  const handleCardClick = async (id) => {
    const clickedNotification = notifications.find(notif => notif.id === id);
   
    const dateMatch = clickedNotification.body.match(/\d{4}-\d{2}-\d{2}/);
    const appointmentDate = dateMatch ? dateMatch[0] : null;

    if (!appointmentDate) {
      toast({ title: "Error", description: "Appointment date not found", variant: "destructive" });
      return;
    }
   
    if (!clickedNotification || !clickedNotification.clinic) {
      toast({ title: "Error", description: "Clinic ID not found", variant: "destructive" });
      return;
    }
  
    
    const clinicId = clickedNotification.clinic;
  
    navigate(`/clinic/${clinicId}/schedule`, {
      state: {
        appointmentDate: appointmentDate,
        clinic_id: clinicId 
  
      },
    });

    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div className="p-6">Loading notifications...</div>;
  }
  

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Notifications</h2>

      <div className="space-y-4">
        {currentPosts.map((notif) => (
          <div
            key={notif.id}
            onClick={() => handleCardClick(notif.id)}
            className={`cursor-pointer rounded-xl p-5 border transition-all shadow-sm hover:shadow-md ${
              notif.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
            }`}
          >
            <p className="text-sm text-gray-900 mt-1">{notif.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Pagination
          totalPosts={lengthN}
          postPerPage={postPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default NotificationPage;
