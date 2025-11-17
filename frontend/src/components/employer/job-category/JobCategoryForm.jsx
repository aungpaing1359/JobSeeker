import React, { useState, useEffect } from "react";
import axios from "axios";
import {toast} from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function JobCategoryForm({ onSuccess, categoryId }) {
  const [categoryName, setCategoryName] = useState("");
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
    setLoading(true);

    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];

    try {
      if (categoryId) {
        // Update
        await axios.put(
          `${API_URL}/job/job-categories/update/${categoryId}/`,
          { name: categoryName },
          {
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrfToken,
            },
            withCredentials: true,
          }
        );
        toast.success("Category updated!");
      } else {
        // Create
        await axios.post(
          `${API_URL}/job/job-categories/create/`,
          { name: categoryName },
          {
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrfToken,
            },
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
      toast.error("Error saving category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {categoryId ? "Edit Category" : "Add Category"}
      </h2>
      <input
        type="text"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        className="border rounded-md px-4 py-2 w-full mb-4"
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
