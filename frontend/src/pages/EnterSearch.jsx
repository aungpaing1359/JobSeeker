import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import jobseekerBg from "../assets/images/jobseekerbg.png";

function EnterSearch() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!keyword.trim() && !location.trim()) {
      toast.error("Please enter keyword or location!");
      return;
    }

    try {
      const res = await axios.get("http://127.0.0.1:8000/job/search/", {
        params: { q: keyword.trim(), loc: location.trim() },
      });

      const jobs = res.data?.results || [];
      toast.success(`Found ${res.data.count || 0} job(s)!`);

      // ✅ navigate and pass results to JobSearchAll.jsx
      navigate("/job-search/all", { state: { jobs } });
    } catch (error) {
      console.error("❌ Search error:", error);
      toast.error("Failed to fetch jobs. Please try again.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <section
      className="bg-cover bg-center bg-no-repeat py-8"
      style={{
        backgroundImage: `url(${jobseekerBg})`,
      }}
    >
      <div className="w-full max-lg:h-[400px] h-[650px] flex items-center justify-center px-4">
        {/* Glass Panel */}
        <div className="backdrop-blur-md bg-[#DBDBDB]/[0.55] shadow-xl rounded-3xl max-lg:p-7 p-10 w-full container mt-28">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 w-full">
            {/* WHAT */}
            <div className="md:col-span-3 relative">
              <p className="search-text-custom mb-2 text-xl font-semibold">
                What
              </p>

              <input
                type="text"
                placeholder="Enter keywords"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyPress}
                className="p-4 h-[60px] rounded-xl border border-gray-300 text-gray-800 bg-white text-lg w-full placeholder-gray-400 focus:outline-none shadow-sm"
              />
            </div>

            {/* WHERE */}
            <div className="md:col-span-2 relative">
              <p className="search-text-custom mb-2 text-xl font-semibold">
                Where
              </p>

              <input
                type="text"
                placeholder="Enter locations"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={handleKeyPress}
                className="p-4 h-[60px] rounded-xl border border-gray-300 text-gray-800 bg-white text-lg w-full placeholder-gray-400 focus:outline-none shadow-sm"
              />
            </div>

            {/* BUTTON */}
            <div className="md:col-span-1 flex items-end">
              <button
                onClick={handleSearch}
                className="h-[60px] w-full px-5 rounded-xl text-lg bg-[#C46210] text-white font-semibold hover:bg-[#AB4812] transition shadow-md"
              >
                Job search
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EnterSearch;
