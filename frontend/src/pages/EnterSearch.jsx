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
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${jobseekerBg})`,
      }}
    >
      <div className="w-full px-4 h-[650px]">
        <div className="h-full w-full flex items-center justify-center md:relative">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 w-full container px-4">
            {/* Keyword input */}
            <div className="md:col-span-3 w-full">
              <input
                type="text"
                placeholder="Enter keywords"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyPress}
                className="p-3 h-[60px] border border-white rounded-md text-white bg-transparent text-lg w-full placeholder-white focus:outline-none"
              />
              <p className="absolute top-64 text-[#ffffffcf] text-xl hidden md:block">
                What
              </p>
            </div>

            {/* Location input */}
            <div className="md:col-span-2 w-full">
              <input
                type="text"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={handleKeyPress}
                className="p-3 h-[60px] border border-white rounded-md text-white bg-transparent text-lg w-full placeholder-white focus:outline-none"
              />
              <p className="absolute top-64 text-[#ffffffcf] text-xl hidden md:block">
                Where
              </p>
            </div>

            {/* Search button */}
            <div className="md:col-span-1 w-full">
              <button
                onClick={handleSearch}
                className="h-[60px] w-full px-5 rounded-md text-lg bg-[#C46210] text-[#ffffffcf] font-semibold hover:bg-[#AB4812] transition cursor-pointer"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EnterSearch;
