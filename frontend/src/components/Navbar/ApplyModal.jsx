import React, { useState } from "react";
import axios from "axios";
import {toast} from "react-hot-toast";

export default function ApplyModal({ isOpen, onClose, job, onSuccess  }) {
  const [coverLetter, setCoverLetter] = useState("");

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + "=")) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!job?.id) {
      alert("Invalid job. Please try again.");
      return;
    }

    const csrftoken = getCookie("csrftoken");
    const token = localStorage.getItem("access");

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/application/application/${job.id}/apply/`,
        {
          cover_letter_text: coverLetter || "No cover letter provided.",
          resume_form: { basic: true },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          withCredentials: true,
        }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Successfully applied for the job!");
        onClose();
        onSuccess?.();
      }
    } catch (error) {
      console.error("Apply error:", error.response?.data || error);
      const data = error.response?.data;

      if (data?.code === "ALREADY_APPLIED") {
        toast.error("You’ve already applied to this job.");
      } else if (data?.code === "JOB_CLOSED") {
        toast.error("This job is no longer accepting applications.");
      } else if (Array.isArray(data?.detail)) {
        toast.error(`${data.detail.join(", ")}`);
      } else {
        toast.error("Failed to apply. Please check your data or login again.");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-start justify-center z-50 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl mt-14 max-h-[90vh] overflow-y-auto animate-slideDown p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Apply for {job.title}</h2>
          <button onClick={onClose} className="text-gray-600 text-lg">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium mb-1">Cover Letter</label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Write something about why you want this job..."
              required
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Submit
            </button>
            <button
              type="button"
              className="bg-blue-100 text-blue-600 px-6 py-2 rounded-lg"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
