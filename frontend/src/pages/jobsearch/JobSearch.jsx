import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import EnterSearch from "../EnterSearch";
import JobDetailView from "./JobDetailView";
import { useAuth } from "../../hooks/useAuth";
import ApplyModal from "../../components/Navbar/ApplyModal";
import { getLocationLabel } from "../../utils/locationHelpers";

export default function JobSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { user, loading } = useAuth();

  const query = new URLSearchParams(location.search);
  const initialMaximized = query.get("maximized") === "true";
  const [isMaximized, setIsMaximized] = useState(initialMaximized);

  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);

  // Modal open state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("access");

        const res = await axios.get("http://127.0.0.1:8000/job/jobs/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const jobList = Array.isArray(res.data.jobs)
          ? res.data.jobs
          : res.data.results
          ? res.data.results
          : [];

        setJobs(jobList);
        setLoadingJobs(false);

        if (id) {
          const job = jobList.find((j) => String(j.id) === String(id));
          setSelectedJob(job || null);
          setSelectedJobId(job ? job.id : null);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, [id]);

  // Apply Now handler
  const handleApplyNow = () => {
    if (loading) return; // still checking auth
    if (user) {
      // If logged in, open modal
      setIsApplyModalOpen(true);
    } else {
      // Not logged in -> redirect
      navigate("/sign-in");
    }
  };

  const handleMaximizeToggle = () => {
    const newState = !isMaximized;
    setIsMaximized(newState);

    const searchParams = new URLSearchParams(location.search);
    if (newState) {
      searchParams.set("maximized", "true");
    } else {
      searchParams.delete("maximized");
    }
    navigate(`${location.pathname}?${searchParams.toString()}`, {
      replace: true,
    });
  };

  return (
    <>
      {/* Hero Search */}
      <EnterSearch />

      {/* Job Count and Filter */}
      {!isMaximized && (
        <div className="container mx-auto pt-8 px-4 grid md:grid-cols-3 gap-6">
          <div className="col-span-1 flex justify-between items-center">
            <span className="border px-3 py-1 rounded-full text-sm">
              {jobs.length} jobs
            </span>
            <button>
              <span className="text-2xl font-bold">⇵</span>
            </button>
          </div>
        </div>
      )}

      {/* Job List and Detail View */}
      <div className="container mx-auto mt-6 px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Job List */}
        {!isMaximized && (
          <div className="md:col-span-1 space-y-4 h-[800px] overflow-y-auto pr-3">
            {loadingJobs ? (
              <p className="text-gray-500 text-center">Loading jobs...</p>
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => {
                    setSelectedJob(job);
                    setSelectedJobId(job.id);
                    navigate(`/job-search/${job.id}`);
                  }}
                  className={`border rounded-lg p-4 shadow-sm cursor-pointer hover:bg-gray-100 ${
                    selectedJobId === job.id ? "bg-gray-200" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="text-sm text-gray-500">
                        {job.employer || "Unknown Company"}
                      </p>
                      <p className="text-sm mt-1">{getLocationLabel(job.location)}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {job.deadline
                          ? `Deadline: ${job.deadline}`
                          : "No deadline"}
                      </p>
                    </div>
                    <img
                      src={job.logo || "/logo.png"}
                      alt="logo"
                      className="w-10 h-10"
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No jobs available</p>
            )}

            <div className="container mx-auto flex justify-end mt-4 mb-8 space-x-2">
              <button
                onClick={() => navigate("/job-search/all")}
                className="flex items-center gap-2 px-5 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100"
              >
                See More →
              </button>
            </div>
          </div>
        )}

        {/* Detail View */}
        <div
          className={`${
            isMaximized ? "md:col-span-3" : "md:col-span-2"
          } p-4 h-[800px] overflow-auto`}
        >
          <JobDetailView
            job={selectedJob}
            isMaximized={isMaximized}
            onToggleMaximize={handleMaximizeToggle}
            onApplyNow={handleApplyNow}
          />
        </div>
      </div>

      {/* Apply Modal */}
      {isApplyModalOpen && (
        <ApplyModal
          isOpen={isApplyModalOpen}
          job={selectedJob}
          onClose={() => setIsApplyModalOpen(false)}
        />
      )}
    </>
  );
}
