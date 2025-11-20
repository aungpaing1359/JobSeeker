import { Save, BookmarkCheck, Building, Briefcase, MapPin, DollarSign, ClipboardList } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { getLocationLabel } from "../../utils/locationHelpers";

export default function JobCard({ job }) {
  const [isSaved, setIsSaved] = useState(job?.is_saved || false);
  const [savedJobId, setSavedJobId] = useState(job?.saved_id || null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  // ------------------ CSRF ------------------
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + "=")) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
  const csrftoken = getCookie("csrftoken");

  // ------------------ Relative Time ------------------
  function getRelativeTime(dateString) {
    if (!dateString) return "No deadline";

    const target = new Date(dateString); // deadline date
    const now = new Date();

    const diffMs = target - now; // ✔ future date တွေအတွက်မှန်တယ်
    const diffSec = Math.floor(diffMs / 1000);

    const minutes = Math.floor(Math.abs(diffSec) / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    // Deadline မကြုံရသေးတဲ့အချိန် (future)
    if (diffMs > 0) {
      if (days > 0) return `${days} days left`;
      if (hours > 0) return `${hours} hours left`;
      if (minutes > 0) return `${minutes} minutes left`;
      return "Ending soon";
    }

    // Deadline ကပြီးသွားပြီ (past)
    if (days > 0) return `${days} days ago`;
    if (hours > 0) return `${hours} hours ago`;
    if (minutes > 0) return `${minutes} minutes ago`;

    return "Just now";
  }

  // ------------------ CHECK SAVED ON MOUNT ------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !job?.id) return;

    async function checkSaved() {
      try {
        const res = await axios.get(`${API_URL}/application/saved/jobs/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const found = res.data.s_savejobs.find(
          (item) => item.job.id === job.id
        );

        if (found) {
          setIsSaved(true);
          setSavedJobId(found.id);
        } else {
          setIsSaved(false);
          setSavedJobId(null);
        }
      } catch (err) {
        console.log("Check saved error", err);
      }
    }

    checkSaved();
  }, [job.id]);

  // ------------------ SAVE / UNSAVE ------------------
  async function handleToggleSave(e) {
    e.stopPropagation();

    const token = localStorage.getItem("token"); // FIXED!!
    if (!token) {
      toast.error("Please sign in to save jobs.");
      navigate("/sign-in");
      return;
    }

    try {
      if (!isSaved) {
        // SAVE job
        await axios.post(
          `${API_URL}/application/save/job/${job.id}/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-CSRFToken": csrftoken, // IMPORTANT!!
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        toast.success("Job saved!");
        setIsSaved(true);
      } else {
        // UNSAVE
        await axios.delete(
          `${API_URL}/application/saved/job/remove/${savedJobId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-CSRFToken": csrftoken, // IMPORTANT!!
            },
            withCredentials: true,
          }
        );

        toast.success("Removed from saved jobs.");
        setIsSaved(false);
        setSavedJobId(null);
      }
    } catch (error) {
      console.error("Save/Unsave Error:", error);

      if (error.response?.status === 403) {
        toast.error("403 Forbidden — Check CSRF or Token");
        return;
      }

      toast.error("Something went wrong!");
    }
  }

  // ------------------ RENDER ------------------
  return (
    <div
      className="bg-white p-4 border border-[#F4F5F7] rounded-3xl shadow-md hover:shadow-lg transition cursor-pointer"
      onClick={() => navigate(`/job-search/${job.id}`)}
    >
      <h3 className="font-semibold text-lg gray-text-custom">{job.title}</h3>

      {/* Job Category and Employer */}
      <p className="text-sm gray-text-custom mt-1 flex items-center gap-2">
        <Briefcase size={16} className="text-purple-500" />
        {job.category_name || "Not specified"}
      </p>
      <p className="text-sm gray-text-custom mt-1 flex items-center gap-2">
        <Building size={16} className="text-orange-500" />
        {job.employer || "Unknown Company"}
      </p>

      {/* Meta Info List with Icons */}
      <ul className="text-sm mt-3 space-y-1 gray-text-custom">
        {/* Location */}
        <li className="flex items-center gap-2">
          <MapPin size={16} className="text-blue-500" />
          <span>{getLocationLabel(job.location || "No location")}</span>
        </li>

        {/* Salary */}
        <li className="flex items-center gap-2">
          <DollarSign size={16} className="text-green-600" />
          <span>${job.salary || "Negotiable"}</span>
        </li>

        {/* Short Description */}
        <li className="flex items-start gap-2 pt-2">
          <ClipboardList
            size={16}
            className="text-gray-400 mt-1 flex-shrink-0"
          />
          <span
            dangerouslySetInnerHTML={{
              __html: job.description
                ? job.description.length > 120
                  ? job.description.slice(0, 120) + "..."
                  : job.description
                : "No description available.",
            }}
          ></span>
        </li>
      </ul>

      <div className="flex items-center justify-between mt-3">
        <p className="text-xs gray-text-custom">
          {getRelativeTime(job.deadline)}
        </p>

        <div className="flex items-center gap-3">
          {isSaved ? (
            <BookmarkCheck
              className="text-green-600 cursor-pointer"
              onClick={handleToggleSave}
            />
          ) : (
            <Save
              className="text-blue-500 cursor-pointer"
              onClick={handleToggleSave}
            />
          )}
        </div>
      </div>
    </div>
  );
}
