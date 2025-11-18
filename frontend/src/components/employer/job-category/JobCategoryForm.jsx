import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function JobCategoryForm({ onSuccess, categoryId }) {
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // Autofocus
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Load category when editing
  useEffect(() => {
    if (!categoryId) return;

    axios
      .get(`${API_URL}/job/job-categories/detail/${categoryId}/`)
      .then((res) => setCategoryName(res.data.name))
      .catch(() => toast.error("Failed to load category details."));
  }, [categoryId]);

  // Get CSRF token
  function getCSRF() {
    return (
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1] || ""
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      toast.error("Category name cannot be empty.", {
        icon: "⚠️", // Friendly warning icon
      });
      return;
    }

    setLoading(true);
    const csrfToken = getCSRF();
    const payload = { name: categoryName.trim() };

    try {
      // EDIT
      if (categoryId) {
        await axios.put(
          `${API_URL}/job/job-categories/update/${categoryId}/`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrfToken,
            },
            withCredentials: true,
          }
        );
        toast.success("Category updated!");
      }

      // CREATE
      else {
        await axios.post(
          `${API_URL}/job/job-categories/create/`,
          payload,
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
      onSuccess?.();

      navigate("/employer/dashboard/job-category");
    } catch (err) {
      console.error("Error saving:", err);

      // 🔥 Handle duplicate category (409)
      if (err?.response?.status === 409) {
        toast.error("You already created this category name.", {
          icon: "ℹ️", // Friendly warning icon
        });
        return;
      }

      toast.error("Error saving category.");
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
        ref={inputRef}
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
