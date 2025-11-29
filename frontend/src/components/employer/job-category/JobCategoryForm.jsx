import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function JobCategoryForm({ onSuccess, categoryId }) {
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState(""); // 💥 frontend error message
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // Edit detail load
  useEffect(() => {
    if (categoryId) {
      axios
        .get(`${API_URL}/job/job-categories/detail/${categoryId}/`)
        .then((res) => setCategoryName(res.data.name))
        .catch((err) => console.error("Error fetching detail:", err));
    }
  }, [categoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 🚨 frontend validation
    if (!categoryName.trim()) {
      setError("Category name is required");
      return;
    }

    setLoading(true);

    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];

    try {
      if (categoryId) {
        await axios.put(
          `${API_URL}/job/job-categories/update/${categoryId}/`,
          { name: categoryName },
          {
            headers: { "X-CSRFToken": csrfToken },
            withCredentials: true,
          }
        );
        toast.success("Category updated!");
      } else {
        await axios.post(
          `${API_URL}/job/job-categories/create/`,
          { name: categoryName },
          {
            headers: { "X-CSRFToken": csrfToken },
            withCredentials: true,
          }
        );
        toast.success("Category created!");
      }

      setCategoryName("");
      onSuccess && onSuccess();
      navigate("/employer/dashboard/job-category");
    } catch (err) {
      console.error("Error saving:", err);

      // 🚨 backend duplicate error handling
      if (err.response?.data?.name) {
        toast.error(err.response.data.name[0]); // serializer error message
      } else {
        toast.error("Error saving category");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {categoryId ? "Edit Category" : "Add Category"}
      </h2>

      {/* 🚨 frontend error message */}
      {error && (
        <p className="text-red-600 text-sm mb-1 font-medium">{error}</p>
      )}

      <input
        type="text"
        value={categoryName}
        onChange={(e) => {
          setCategoryName(e.target.value);
          setError(""); // typing လုပ်ရင် error clear
        }}
        className={`border rounded-md px-4 py-2 w-full mb-4 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        placeholder="Category name"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-orange-600 text-white px-4 py-2 rounded-md"
      >
        {loading ? "Saving..." : categoryId ? "Update" : "Add"}
      </button>
    </form>
  );
}
