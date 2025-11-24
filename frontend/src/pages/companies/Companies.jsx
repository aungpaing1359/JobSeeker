// src/pages/companies/Companies.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import jobseekerBg from "../../assets/images/jobseekerbg.png";

const Companies = ({ collapse }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const API_URL = import.meta.env.VITE_API_URL;

  // Responsive itemsPerPage
  const updateItemsPerPage = () => {
    const width = window.innerWidth;
    if (width >= 1024) {
      // xl: >=1024px
      setItemsPerPage(12);
    } else if (width >= 768) {
      // lg: >=768px
      setItemsPerPage(9);
    } else if (width >= 548) {
      // md: >=548px
      setItemsPerPage(8);
    } else {
      // sm: <548px
      setItemsPerPage(6);
    }
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem("access");
        const res = await axios.get(`${API_URL}/accounts-employer/company/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        setCompanies(res.data.companies || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setLoading(false);
      }
    };

    fetchCompanies();

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const totalPages = Math.ceil(companies.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCompanies = companies.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading) {
    return <div className="text-center py-20">Loading companies...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className={`bg-cover bg-center bg-no-repeat transition-all duration-500 overflow-hidden ${
          collapse
            ? "h-0 py-0 opacity-0"
            : "h-[530px] max-2xl:h-[350px] max-xl:h-[320px] max-lg:h-[300px] py-8 opacity-100"
        }`}
        style={{
          backgroundImage: `url(${jobseekerBg})`,
        }}
      >
        <div className="container mx-auto px-4 w-full h-[300px]">
          <div className="h-full w-full flex flex-col justify-center items-start mt-28 max-2xl:mt-0">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Find jobs from companies near you.
              </h1>
              <p className="mb-6">
                You can search for jobs from any company you like.
              </p>
            </div>

            <div className="grid grid-cols-6 gap-4 w-full container">
              <div className="max-sm:col-span-4 col-span-3 w-full">
                <input
                  type="text"
                  placeholder="Search"
                  className="p-4 max-md:h-[40px] max-xl:h-[48px] h-[55px] rounded-xl border border-gray-300 text-gray-800 bg-white max-md:text-base text-lg w-full placeholder-gray-400 focus:outline-none shadow-sm"
                />
              </div>
              <div className="max-sm:col-span-2 col-span-1 w-full">
                <button className="max-md:h-[40px] max-xl:h-[48px] h-[55px] w-full px-5 rounded-xl max-md:text-base text-lg bg-[#C46210] text-white font-semibold hover:bg-[#AB4812] transition shadow-md">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Companies */}
      <section className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-center mb-2">
          All Companies Showing
        </h2>
        <p className="text-center text-gray-500 mb-8">
          You can choose the company you want to work for.
        </p>

        {/* Companies Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7"
          style={{
            gridTemplateColumns:
              window.innerWidth >= 1024
                ? "repeat(4, 1fr)"
                : window.innerWidth >= 768
                ? "repeat(3, 1fr)"
                : window.innerWidth >= 548
                ? "repeat(2, 1fr)"
                : "repeat(1, 1fr)",
          }}
        >
          {currentCompanies.map((company) => (
            <div
              key={company.id}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 cursor-pointer flex flex-col items-center"
            >
              <Link
                to={`/companies/${company.id}`}
                className="w-full flex flex-col items-center"
              >
                {/* Logo */}
                <div className="flex items-center gap-2 mb-2 overflow-hidden">
                  <img
                    src={
                      company.logo ? `${API_URL}${company.logo}` : "/logo.png"
                    }
                    alt="Company Logo"
                    className="w-20 h-20 object-contain"
                  />
                </div>

                {/* Business Name */}
                <h3 className="text-sm gray-text-custom my-2 flex items-center">
                  {company.business_name || "Not specified"}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-500 text-center line-clamp-2 mb-4">
                  {" "}
                  {company.description ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: company.description }}
                    />
                  ) : (
                    <p className="text-gray-500 italic">
                      {" "}
                      No description provided.{" "}
                    </p>
                  )}{" "}
                </p>

                {/* Job Count Button */}
                <button className="px-5 py-2 border rounded-xl bg-white border-[#1A82DE] text-[#1A82DEEB] font-medium cursor-pointer hover:font-bold">
                  {company.job_count || "0"} jobs
                </button>
              </Link>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-10 space-x-2 items-center">
          {currentPage > 1 && (
            <button
              onClick={handlePrev}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md"
            >
              Prev
            </button>
          )}
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-8 h-8 rounded-md ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
          {currentPage < totalPages && (
            <button
              onClick={handleNext}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md"
            >
              Next
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Companies;
