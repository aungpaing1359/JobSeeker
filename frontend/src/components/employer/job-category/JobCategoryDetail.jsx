import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function JobCategoryDetail() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/job/job-categories/detail/${id}/`)
      .then((res) => setCategory(res.data))
      .catch((err) => console.error("Error fetching detail:", err));
  }, [id]);

  if (!category) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Category Detail</h2>
      <p>
        <strong>Name:</strong> {category.name}
      </p>
    </div>
  );
}
