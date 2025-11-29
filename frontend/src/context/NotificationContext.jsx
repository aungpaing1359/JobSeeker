import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  fetchNotifications,
  markAsRead,
  markAsUnread,
  deleteNotification,
  deleteAllNotifications,
} from "../utils/api/notificationAPI";
import { toast } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";   // ✅ Use your real auth hook

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();                 // 🔥 REAL user source

  const [notifications, setNotifications] = useState([]);
  const [counts, setCounts] = useState({ total: 0, read: 0, unread: 0 });
  const [loading, setLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    if (!user?.id) return;                    // ⛔ Prevent API calls before user loads

    setLoading(true);
    try {
      const data = await fetchNotifications();
      setNotifications(data.all_list);
      setCounts(data.counts);
    } catch (err) {
      console.error("Failed to load notifications:", err);

      // Avoid showing error during refresh
      if (user?.id) toast.error("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      loadNotifications();
    }
  }, [user?.id, loadNotifications]);

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      loadNotifications();
    } catch (err) {
      toast.error("Failed to mark notification as read.");
    }
  };

  const handleMarkUnread = async (id) => {
    try {
      await markAsUnread(id);
      loadNotifications();
    } catch (err) {
      toast.error("Failed to mark notification as unread.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      loadNotifications();
    } catch (err) {
      toast.error("Failed to delete notification.");
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllNotifications();
      loadNotifications();
    } catch (err) {
      toast.error("Failed to clear notifications.");
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        counts,
        loading,
        loadNotifications,
        handleMarkRead,
        handleMarkUnread,
        handleDelete,
        handleDeleteAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => useContext(NotificationContext);
