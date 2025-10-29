import React, { useEffect, useState } from "react";
import axios from "axios";
import JobCategoryForm from "../../../components/employer/job-category/JobCategoryForm";
import JobCategoryList from "../../../components/employer/job-category/JobCategoryList";
import JobCategoryDeleteModal from "../../../components/employer/job-category/JobCategoryDeleteModal";
import {toast} from "react-hot-toast";

export default function JobCategoryListPage() {
  const [categories, setCategories] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/job/job-categories/");
      console.log(res.data);
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;

    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];

    try {
      await axios.delete(
        `http://127.0.0.1:8000/job/job-categories/delete/${id}/`,
        { headers: { "X-CSRFToken": csrfToken }, withCredentials: true }
      );
      toast.success("✅ Category deleted!");
      setDeleteId(null);
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      toast.error("❌ Error deleting category");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-6">
      <JobCategoryForm onSuccess={fetchCategories} />
      <JobCategoryList categories={categories} onDelete={(id) => setDeleteId(id)} />

      <JobCategoryDeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => handleDelete(deleteId)}
      />
    </div>
  );
}
