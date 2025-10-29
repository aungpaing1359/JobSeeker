// src/pages/JobApplications.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { FileText, Trash2, Briefcase, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

export default function JobApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchApplications() {
      try {
        setLoading(true);
        setError(null);
        const csrftoken = getCookie("csrftoken");

        const response = await axios.get(
          "http://127.0.0.1:8000/application/application/apply/jobs/list/",
          {
            headers: {
              "X-CSRFToken": csrftoken,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        const data = response.data;

        if (Array.isArray(data.apply_jobs)) {
          setApplications(data.apply_jobs);
        } else {
          console.warn("Unexpected response format:", data);
          setApplications([]);
        }
      } catch (err) {
        console.error("Failed to fetch applications:", err);
        setError("Failed to load job applications");
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, []);

  const handleDelete = async (applicationId) => {
    const csrftoken = getCookie("csrftoken");
    try {
      await axios.delete(
        `http://127.0.0.1:8000/application/application/apply/job/remove/${applicationId}/`,
        {
          headers: {
            "X-CSRFToken": csrftoken,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setApplications((prev) => prev.filter((app) => app.id !== applicationId));
      setMessage("✅ Application removed!");

      setTimeout(() => setMessage(null), 2500);
    } catch (error) {
      console.error("Failed to delete application:", error);
    }
  };

  if (loading) return <p className="p-8 text-center">Loading...</p>;
  if (error)
    return <p className="p-8 text-center text-red-500 font-medium">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-6 py-10 flex-grow">
        <h2 className="text-xl font-semibold mb-3">Job Applications</h2>

        {message && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
            {message}
          </div>
        )}

        {applications.length === 0 ? (
          <div className="text-center py-20">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-500/90 text-white rounded-full p-4 w-16 h-16 flex items-center justify-center">
                <FileText size={28} />
              </div>
            </div>
            <p className="text-gray-700 font-medium">
              No job applications yet.
            </p>
            <p className="text-gray-500 mt-1 text-sm">
              Apply to jobs to see them listed here.
            </p>
          </div>
        ) : (
          <div
            className={`grid gap-5 ${
              applications.length % 2 === 1
                ? "grid-cols-1 sm:grid-cols-2 auto-rows-auto"
                : "grid-cols-1 sm:grid-cols-2"
            }`}
          >
            {applications.map((app, index) => (
              <div
                key={app.id}
                className={`bg-gray-50 border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition relative ${
                  // နောက်ဆုံးတစ်ခုကျန်တဲ့အခါ grid column 2ခုပြည့်ယူအောင်
                  applications.length % 2 === 1 &&
                  index === applications.length - 1
                    ? "sm:col-span-2"
                    : ""
                }`}
              >
                <button
                  onClick={() => handleDelete(app.id)}
                  className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white rounded-full p-2"
                >
                  <Trash2 size={16} />
                </button>

                <h3 className="text-[16px] font-semibold flex items-center gap-2">
                  <Briefcase size={18} className="text-[#D2691E]" />
                 {app.job?.title || "Untitled Job"}
                </h3>

                <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                  <Building2 size={16} className="text-gray-500" />
                  {app.job?.employer || "Unknown Company"}
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  Applied at: {new Date(app.applied_at).toLocaleString()}
                </p>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    className="mt-2 bg-[#D2691E] hover:bg-[#b45717] text-white text-sm font-medium py-2 px-5 rounded-md"
                    onClick={() => navigate(`/job-search/${app.job}`)}
                  >
                    View Job
                  </button>
                  <button
                    className="mt-2 bg-[#1E90FF] hover:bg-[#187bcd] text-white text-sm font-medium py-2 px-5 rounded-md"
                    onClick={() =>
                      navigate(`/job-search/applications/${app.id}`)
                    }
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
