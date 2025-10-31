import { Save, ChevronDown } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {toast} from "react-hot-toast";

export default function JobCard({ job }) {
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const navigate = useNavigate();

  function getRelativeTime(dateString) {
    if (!dateString) return "No deadline";

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);

    const minutes = Math.floor(diffSec / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
    if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
    if (weeks > 0) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

    return "Just now";
  }

  const csrftoken = getCookie("csrftoken");

  async function handleSaveJob(e) {
    e.stopPropagation();
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/application/save/job/${job.id}/`,
        {},
        {
          headers: {
            "X-CSRFToken": csrftoken,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success("Job saved successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Failed to save job:", error);
      toast.error("Failed to save job!");
    }
  }

  return (
    <div
      className="bg-white p-4 rounded shadow hover:shadow-md transition cursor-pointer"
      onClick={() => navigate(`/job-search/${job.id}`)}
    >
      <h3 className="font-semibold text-lg gray-text-custom">{job.title}</h3>
      <p className="text-sm gray-text-custom">
        {job.category_name || "Not specified"}
      </p>
      <p className="text-sm gray-text-custom">
        {job.employer || "Unknown Company"}
      </p>
      <ul className="text-sm mt-2 list-disc list-inside gray-text-custom">
        <li className="gray-text-custom">{job.location || "No location"}</li>
        <li className="gray-text-custom">${job.salary || "Negotiable"}</li>
        <li
          className="gray-text-custom"
          dangerouslySetInnerHTML={{
            __html: job.description
              ? job.description.length > 100
                ? job.description.slice(0, 100) + "..."
                : job.description
              : "No description available",
          }}
        ></li>
      </ul>
      <div className="flex items-center justify-between mt-3">
        <p className="text-xs gray-text-custom">
          {getRelativeTime(job.deadline)}
        </p>
        <div className="flex items-center gap-3">
          <Save
            className="text-blue-500 cursor-pointer"
            onClick={handleSaveJob}
          />
        </div>
      </div>
    </div>
  );
}
