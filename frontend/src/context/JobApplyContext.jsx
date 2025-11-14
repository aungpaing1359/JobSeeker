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
      const normalized = data.map((item) => ({
        ...item,
        job: {
          ...item.job,
          isApplied: item.is_applied, // convert snake_case to camelCase
        },
      }));
      setSavedJobs(normalized);
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
      // Add new application record
      addApplication({
        id: Date.now(),
        job: {
          title: job.title,
          employer: job.employer_name || "Unknown",
        },
        applied_at: new Date().toISOString(),
      });

      // ✅ Update savedJobs locally
      setSavedJobs((prev) =>
        prev.map((item) =>
          item.job?.id === job.id
            ? { ...item, job: { ...item.job, isApplied: true } }
            : item
        )
      );
      onSuccess?.(); // trigger toast from SaveJobs or Modal
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
      const token = localStorage.getItem("access");
      const res = await axios.post(
        `http://127.0.0.1:8000/application/save/job/${job.id}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ backend DB save success
      const savedData = res.data.data;

      // ✅ frontend state update immediately
      setSavedJobs((prev) => {
        const exists = prev.some((j) => j.job?.id === job.id);
        if (exists) return prev;

        return [savedData, ...prev];
      });

      toast.success(res.data.message || "Job saved successfully!");
      console.log("✅ Save API Response:", res.data);
    } catch (error) {
      const data = error.response?.data;
      if (data?.detail?.includes("already saved")) {
        toast.error("You have already saved this job");
      } else {
        toast.error("Failed to save job.");
      }
      console.error("❌ Save job failed:", error);
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
