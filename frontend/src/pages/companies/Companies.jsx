// src/pages/companies/Companies.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Responsive itemsPerPage
  const updateItemsPerPage = () => {
    const width = window.innerWidth;
    if (width >= 1024) {
      // xl: >=1024px
      setItemsPerPage(20);
    } else if (width >= 768) {
      // lg: >=768px
      setItemsPerPage(15);
    } else if (width >= 640) {
      // md: >=640px
      setItemsPerPage(10);
    } else {
      // sm: <640px
      setItemsPerPage(6);
    }
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem("access");
        const res = await axios.get(
          "http://127.0.0.1:8000/accounts-employer/company/",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
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
      <section className="bg-gradient-to-r from-[#002366] to-[#003AB3] py-8 mb-6">
        <div className="container mx-auto px-4 w-full h-[300px]">
          <div className="h-full w-full flex flex-col justify-center items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-[#ffffffcf]">
                Find jobs from companies near you.
              </h1>
              <p className="mb-6 text-[#ffffffcf]">
                You can search for jobs from any company you like.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 w-full container">
              <div className="md:col-span-3 w-full">
                <input
                  type="text"
                  placeholder="Search"
                  className="p-3 h-[60px] border border-[#999] rounded-md bg-[#ffffffcf] text-lg w-full placeholder:text-blue-400"
                />
              </div>
              <div className="md:col-span-1 w-full">
                <button className="h-[60px] w-full px-5 rounded-md text-lg bg-[#C46210] text-[#ffffffcf] font-semibold hover:bg-[#AB4812] transition">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentCompanies.map((company) => (
            <div
              key={company.id}
              className="border rounded-lg p-4 text-center shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <Link to={`/companies/${company.id}`}>
                <img
                  src={company.logo ? `http://127.0.0.1:8000${company.logo}` : "/logo.png"}
                  alt={company.business_name}
                  className="w-16 h-16 mx-auto mb-4"
                />
                <h3 className="font-semibold text-lg mb-2">{company.business_name}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {company.industry || "No industry info"}
                </p>
                <button className="px-4 py-2 text-sm bg-gray-100 text-blue-600 font-medium rounded-md">
                  {company.job_count || "0"} Jobs
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
