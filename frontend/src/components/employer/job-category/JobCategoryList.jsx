import React from "react";
import { Link } from "react-router-dom";

export default function JobCategoryList({ categories, onDelete }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Category List</h2>
      <ul className="space-y-2">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <li
              key={cat.id}
              className="px-4 py-2 border rounded-md shadow-sm flex justify-between items-center"
            >
              <span>{cat.name}</span>
              <div className="flex gap-3 text-sm">
                <Link
                  to={`/employer/dashboard/job-categories/${cat.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Detail
                </Link>
                <Link
                  to={`/employer/dashboard/job-categories/${cat.id}/edit`}
                  className="text-green-600 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => onDelete(cat.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No categories found</p>
        )}
      </ul>
    </div>
  );
}
