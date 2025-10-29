import React from "react";
import jobseekerBg from "../assets/images/jobseekerbg.png"

function EnterSearch() {
  return (
    <section
      className="bg-cover bg-center bg-no-repeat py-8"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${jobseekerBg})`,
      }}
    >
      <div className="w-full px-4 h-[650px]">
        {/* Center contents both vertically and horizontally */}
        <div className="h-full w-full flex items-center justify-center md:relative">
          {/* Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 w-full container px-4">
            {/* Keyword input (3 cols) */}
            <div className="md:col-span-3 w-full ">
              <input
                type="text"
                placeholder="Enter keywords"
                className="p-3 h-[60px] border border-white rounded-md text-white bg-transparent text-lg w-full placeholder-white focus:outline-none"
              />
              <p className="absolute top-64 text-[#ffffffcf] text-xl hidden md:block">
                What
              </p>
            </div>

            {/* Location input (2 cols) */}
            <div className="md:col-span-2 w-full">
              <input
                type="text"
                placeholder="Enter location"
                className="p-3 h-[60px] border border-white rounded-md text-white bg-transparent text-lg w-full placeholder-white focus:outline-none"
              />
              <p className="absolute top-64 text-[#ffffffcf] text-xl hidden md:block">
                Where
              </p>
            </div>

            {/* Job Search Button (1 col) */}
            <div className="md:col-span-1 w-full">
              <button className="h-[60px] w-full px-5 rounded-md text-lg bg-[#C46210] text-[#ffffffcf] font-semibold hover:bg-[#AB4812] transition cursor-pointer">
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
