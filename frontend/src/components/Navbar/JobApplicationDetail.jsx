// src/pages/JobApplicationDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function JobApplicationDetail() {
  const { id } = useParams(); // application id
  const [applicationDetail, setApplicationDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchApplicationDetail() {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/application/application/apply/job/detail/${id}/`,
          { withCredentials: true }
        );
        console.log("API Response:", response.data);
        setApplicationDetail(response.data.application_detail);
      } catch (error) {
        console.error("Failed to load job application detail:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchApplicationDetail();
  }, [id]);

  if (loading)
    return <p className="p-8 text-center">Loading job application detail...</p>;
  if (!applicationDetail)
    return <p className="p-8 text-center">Job application not found.</p>;

  const { applied_at, job } = applicationDetail;

  return (
    <div className="container mx-auto px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 underline text-sm"
      >
        ← Back
      </button>

      {/* ✅ Job Information */}
      <h1 className="text-2xl font-semibold mb-2">{job?.title}</h1>
      <p className="text-gray-600">{job?.employer}</p>
      <p className="text-gray-500 text-sm mb-3">
        {job?.location} • {job?.job_type}
      </p>

      {/* ✅ Applied Date */}
      <p className="text-sm text-gray-600 mt-1">
        Applied at:{" "}
        {applied_at ? new Date(applied_at).toLocaleString() : "—"}
      </p>

      {/* ✅ Job Details */}
      <div className="bg-gray-50 p-5 rounded-lg border mt-4">
        <p className="text-gray-700 mb-2">
          <strong>Category:</strong> {job?.category_name}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Salary:</strong> ${job?.salary}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Deadline:</strong>{" "}
          {job?.deadline
            ? new Date(job.deadline).toLocaleDateString()
            : "—"}
        </p>
        <p className="text-gray-700 mt-4 whitespace-pre-wrap">
          {job?.description}
        </p>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => navigate(`/job-search/${job?.id}`)}
          className="bg-[#D2691E] hover:bg-[#b45717] text-white py-2 px-6 rounded-md"
        >
          View Job Post
        </button>

        <button
          onClick={() => window.print()}
          className="bg-gray-200 hover:bg-gray-300 text-black py-2 px-4 rounded-md"
        >
          Print
        </button>
      </div>
    </div>
  );
}
