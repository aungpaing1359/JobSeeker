// src/api/notificationAPI.js
import axios from "axios";
// import { NOTIFICATION_ENDPOINTS } from "../constants/notificationConstants";
import { NOTIFICATION_ENDPOINTS } from "../constants/notificationConstants";

export const getCSRFToken = () => {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken"))
    ?.split("=")[1];
  return cookieValue || "";
};

// Notifications List
export const fetchNotifications = async () => {
  const res = await axios.get(NOTIFICATION_ENDPOINTS.LIST, {
    withCredentials: true,
    headers: {
      "X-CSRFToken": getCSRFToken(),
    },
  });
  return res.data;
};

// Mark as Read
export const markAsRead = async (id) => {
  const res = await axios.post(
    NOTIFICATION_ENDPOINTS.MARK_READ(id),
    {},
    {
      withCredentials: true,
      headers: {
        "X-CSRFToken": getCSRFToken(),
      },
    }
  );
  return res.data;
};

// Mark as Unread
export const markAsUnread = async (id) => {
  const res = await axios.post(
    NOTIFICATION_ENDPOINTS.MARK_UNREAD(id),
    {},
    {
      withCredentials: true,
      headers: {
        "X-CSRFToken": getCSRFToken(),
      },
    }
  );
  return res.data;
};

// Delete One
export const deleteNotification = async (id) => {
  const res = await axios.delete(NOTIFICATION_ENDPOINTS.DELETE_ONE(id), {
    withCredentials: true,
    headers: {
      "X-CSRFToken": getCSRFToken(),
    },
  });
  return res.data;
};

// Delete All
export const deleteAllNotifications = async () => {
  const res = await axios.delete(NOTIFICATION_ENDPOINTS.DELETE_ALL, {
    withCredentials: true,
    headers: {
      "X-CSRFToken": getCSRFToken(),
    },
  });
  return res.data;
};
