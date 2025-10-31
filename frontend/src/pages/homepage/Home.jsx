import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import EnterSearch from "../EnterSearch";
import FeaturedCompanies from "./FeatureCompanies";
import JobCard from "./JobCard";
import QuickSearchSection from "./QuickSearchSection";

export default function Home() {
  const navigateCompany = useNavigate();
  const navigateJobs = useNavigate();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/job/jobs/")
      .then((res) => {
        console.log("Job API Response:", res.data);
        const data = res.data.jobs || [];
        setJobs(data);
      })
      .catch((err) => {
        console.error("Error fetching jobs:", err);
      });
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Job Search Section */}
      <EnterSearch />

      {/* Featured Companies */}
      <section className="container mx-auto text-center py-8">
        <div className="py-4">
          <h2 className="text-2xl font-bold gray-text-custom">Featured Companies</h2>
          <p className="gray-text-custom">Work for the best companies on the website</p>
        </div>

        <FeaturedCompanies />

        <div className="py-4 text-start px-4">
          <button
            onClick={() => navigateCompany("/companies")}
            className="px-2 py-1 border rounded-md cursor-pointer transition custom-blue-text custom-blue-border hover-blue hover:bg-gray-200"
          >
            View All 🡆
          </button>
        </div>
      </section>

      {/* Job Offers */}
      <section className="bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-center py-4 gray-text-custom">Job Offers</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.slice(0, 12).map((job, i) => (
              <JobCard key={i} job={job} />
            ))}
          </div>
          <div className="py-4 text-center">
            <button
              onClick={() => navigateJobs("/job-search/all")}
              className="px-2 py-1 border rounded-md cursor-pointer transition custom-blue-text custom-blue-border hover-blue hover:bg-gray-200"
            >
              View All 🡆
            </button>
          </div>
        </div>
      </section>

      {/* Quick Search */}
      <QuickSearchSection />
    </div>
  );
}
