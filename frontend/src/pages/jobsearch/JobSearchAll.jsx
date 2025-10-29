import React, { useEffect, useState } from "react";
import { FaBookmark } from "react-icons/fa";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import EnterSearch from "../EnterSearch";
import QuickSearchSection from "../homepage/QuickSearchSection";
import { useNavigate } from "react-router-dom";

// Job Card Component
const JobCard = ({ job, onClick }) => (
  <div
    onClick={onClick}
    className="border border-gray-300 rounded-lg p-4 relative shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
  >
    <div className="absolute top-4 right-4 text-blue-500">
      <FaBookmark size={20} />
    </div>
    <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
    <p className="text-sm text-gray-600">{job.employer || "Unknown Company"}</p>
    <p className="text-sm text-gray-500 mt-1">{job.location}</p>
    <div
      className="text-sm text-gray-700 mt-3"
      dangerouslySetInnerHTML={{
        __html:
          job.description?.length > 120
            ? job.description.slice(0, 120) + "..."
            : job.description || "No description available",
      }}
    ></div>
    <p className="text-sm text-gray-400 mt-4">
      {job.deadline ? `Deadline: ${job.deadline}` : "No deadline"}
    </p>
  </div>
);

const JobSearchAll = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 15;

  useEffect(() => {
    fetch("http://127.0.0.1:8000/job/jobs/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Jobs API Response:", data);

        const jobList = Array.isArray(data)
          ? data
          : Array.isArray(data.results)
          ? data.results
          : Array.isArray(data.jobs)
          ? data.jobs
          : [];

        setJobs(jobList);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching jobs:", err);
        setLoading(false);
      });
  }, []);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  return (
    <div>
      <EnterSearch />

      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Jobs you can apply for as you wish
          </h2>
          <div className="flex space-x-2">
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm">
              {jobs.length} Jobs
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm">
              New
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading jobs...</p>
        ) : currentJobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {currentJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onClick={() => navigate(`/job-search/${job.id}`)}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No jobs available</p>
        )}

        {/* Pagination Section */}
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              <HiOutlineChevronLeft size={20} className="text-gray-600" />
            </button>

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              <HiOutlineChevronRight size={20} className="text-gray-600" />
            </button>
          </nav>
        </div>
      </div>

      <QuickSearchSection />
    </div>
  );
};

export default JobSearchAll;
