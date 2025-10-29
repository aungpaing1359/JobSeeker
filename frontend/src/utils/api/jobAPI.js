// src/utils/api/jobAPI.js
import api from "../axiosInstance";
import {
  JOBS_ENDPOINT,
  JOB_CREATE,
  JOB_DETAIL,
  JOB_UPDATE,
  JOB_DELETE,
  JOB_CATEGORIES,
} from "../constants/apiJobendpoints";

export const getCsrfToken = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="))
    ?.split("=")[1];
};

// Create Job
export const createJob = (data) =>
  api.post(JOB_CREATE, data, {
    headers: {
      "X-CSRFTOKEN": getCsrfToken(),
    },
    withCredentials: true,
  });

// Get Jobs
export const getJobs = () => api.get(JOBS_ENDPOINT, { withCredentials: true });

// Get Job Detail
export const getJobDetail = (id) =>
  api.get(JOB_DETAIL(id), { withCredentials: true });

// Update Job
export const updateJob = (id, data) =>
  api.put(JOB_UPDATE(id), data, {
    headers: {
      "X-CSRFToken": getCsrfToken(),
    },
    withCredentials: true,
  });

// Delete Job
export const deleteJob = (id) =>
  api.delete(JOB_DELETE(id), {
    headers: {
      "X-CSRFToken": getCsrfToken(),
    },
    withCredentials: true,
  });
  
// Get all job categories
export const getCategories = () =>
  api.get(JOB_CATEGORIES, { withCredentials: true });

