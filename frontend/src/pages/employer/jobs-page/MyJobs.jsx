import React, { useState, useEffect } from "react";
import { getJobs, deleteJob } from "../../../utils/api/jobAPI";
import { useNavigate } from "react-router-dom";
import JobDeleteModal from "../../../components/employer/jobs/JobDeleteModal";

// Get CSRF Token
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
const csrftoken = getCookie("csrftoken");

export default function MyJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showConfirm, setShowConfirm] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getJobs();
        setJobs(res.data.jobs || []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };
    fetchData();
  }, []);

  const confirmDelete = (id) => {
    setJobToDelete(id);
    setShowConfirm(true);
  };

  const handleDelete = async (id) => {
    if (!id) return;
    try {
      await deleteJob(id, csrftoken);
      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (err) {
      console.error("Error deleting job:", err);
    } finally {
      setShowConfirm(false);
      setJobToDelete(null);
    }
  };

  const handleDetail = (id) => navigate(`/employer/dashboard/my-jobs/${id}/detail`);
  const handleEdit = (job) => navigate(`/employer/dashboard/my-jobs/${job.id}/edit`);

  // Filtered jobs by search and status
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" ||
      job.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-semibold text-gray-700">Post Jobs</h1>
        <button
          onClick={() => navigate("/employer/dashboard/job-create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
        >
          + Create a Job
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-white border rounded-md p-3 shadow-sm focus:outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-48 bg-white border rounded-md p-3 shadow-sm"
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Closed</option>
          <option>Pending</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-gray-700 font-semibold text-sm">Title</th>
              <th className="p-3 text-gray-700 font-semibold text-sm">Job Category</th>
              <th className="p-3 text-gray-700 font-semibold text-sm">Post Date</th>
              <th className="p-3 text-gray-700 font-semibold text-sm">Job Title</th>
              <th className="p-3 text-gray-700 font-semibold text-sm">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <tr key={job.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="p-3 text-gray-800">{job.title || "N/A"}</td>
                  <td className="p-3 text-gray-600">{job.category_name || "N/A"}</td>
                  <td className="p-3 text-gray-600">
                    {job.created_at
                      ? new Date(job.created_at).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="p-3 text-gray-600">
                    {job.title || "Job Title"}
                  </td>
                  <td className="p-3 space-x-3">
                    <button
                      onClick={() => handleDetail(job.id)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(job)}
                      className="text-green-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(job.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No jobs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination UI only */}
      <div className="flex justify-end items-center mt-6 space-x-2 text-sm text-gray-600">
        <button className="px-3 py-1 border rounded hover:bg-gray-100">1</button>
        <button className="px-3 py-1 border rounded hover:bg-gray-100">2</button>
        <button className="px-3 py-1 border rounded hover:bg-gray-100">3</button>
        <button className="px-3 py-1 border rounded hover:bg-gray-100">Next &gt;</button>
      </div>

      {/* Delete Modal */}
      <JobDeleteModal
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => handleDelete(jobToDelete)}
        title="Confirm Delete"
        message="Are you sure you want to delete this job?"
      />
    </div>
  );
}

