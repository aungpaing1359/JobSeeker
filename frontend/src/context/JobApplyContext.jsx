// src/context/JobApplyContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useJobApplyAuth } from "../hooks/useJobApplyAuth";
import {
  fetchApplyJobs,
  deleteApplyJob,
  fetchApplicationDetail,
  fetchSavedJobs,
} from "../utils/api/jobapplyAPI";
import { toast } from "react-hot-toast";

const JobApplyContext = createContext();

export const JobApplyProvider = ({ children }) => {
  const {
    applyJob: applyJobAPI,
    handleSaveJob,
    handleRemoveSavedJob,
    loading: applyLoading,
  } = useJobApplyAuth();

  const [applications, setApplications] = useState([]);
  const [applicationDetail, setApplicationDetail] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  //  Load Applications
  useEffect(() => {
    loadApplications();
    loadSavedJobs();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await fetchApplyJobs();
      setApplications(data);
    } finally {
      setLoading(false);
    }
  };

  // Load Saved Jobs
  const loadSavedJobs = async () => {
    try {
      const data = await fetchSavedJobs();
      setSavedJobs(data);
    } catch (error) {
      console.error("Failed to load saved jobs:", error);
      toast.error("Failed to load saved jobs.");
    }
  };

  // ✅ Fetch single application detail
  const getApplicationDetail = async (id) => {
    setLoading(true);
    try {
      const data = await fetchApplicationDetail(id);
      setApplicationDetail(data);
    } catch (error) {
      console.error("❌ Failed to load job application detail:", error);
      toast.error("Failed to load job application detail.");
    } finally {
      setLoading(false);
    }
  };

  // Add new application
  const addApplication = (app) => {
    setApplications((prev) => [app, ...prev]);
  };

  //Apply job
  const applyJob = async (job, coverLetter, onSuccess) => {
    await applyJobAPI(job, coverLetter, () => {
      addApplication({
        id: Date.now(),
        job: {
          title: job.title,
          employer: job.employer_name || "Unknown",
        },
        applied_at: new Date().toISOString(),
      });

      onSuccess?.();
    });
  };

  // Remove application
  const removeApplication = async (id) => {
    await deleteApplyJob(id);
    setApplications((prev) => prev.filter((a) => a.id !== id));
    setMessage("Application removed!");
    setTimeout(() => setMessage(null), 2000);
  };

  // Save Job
  const saveJob = async (job) => {
    try {
      await handleSaveJob(job.id, (res) => {
        // ✅ local update immediately
        setSavedJobs((prev) => {
          const exists = prev.some((j) => j.job?.id === job.id);
          if (exists) return prev; // already in list

          // new saved job object
          const newSavedJob = {
            id: res?.id || Date.now(), // fallback if API didn’t return id
            job: {
              ...job,
            },
            is_applied: false,
          };
          return [newSavedJob, ...prev];
        });
      });
    } catch (error) {
      console.error("❌ Failed to save job:", error);
    }
  };

  // Remove Saved Job
  const unsaveJob = async (savedJobId) => {
    try {
      await handleRemoveSavedJob(savedJobId, () => {
        // ✅ local state ထဲကနေ တစ်ခုပဲ filter လုပ်ဖျက်လိုက်မယ်
        setSavedJobs((prev) => prev.filter((job) => job.id !== savedJobId));
      });
    } catch (error) {
      console.error("❌ Failed to unsave job:", error);
    }
  };

  return (
    <JobApplyContext.Provider
      value={{
        applications,
        applicationDetail,
        savedJobs,
        loading,
        message,

        applyJob,
        applyLoading,
        saveJob,
        unsaveJob,
        addApplication,
        removeApplication,
        getApplicationDetail,
      }}
    >
      {children}
    </JobApplyContext.Provider>
  );
};

export const useJobApply = () => useContext(JobApplyContext);
