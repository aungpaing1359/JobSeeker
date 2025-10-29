import React, { useEffect, useState } from "react";
import axios from "axios";

export default function EducationList({
  profileId,
  educationList,
  setEducationList,
  onEdit,
}) {
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Education Data
  useEffect(() => {
    if (!profileId) return;

    setLoading(true);
    axios
      .get(
        `http://127.0.0.1:8000/accounts-jobseeker/education/?profile=${profileId}`,
        { withCredentials: true }
      )
      .then((res) => {
        setEducationList(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching education:", err);
        setLoading(false);
      });
  }, [profileId, setEducationList]);

  if (loading) {
    return (
      <div className="text-gray-500 text-sm italic">Loading education...</div>
    );
  }

  if (!educationList || educationList.length === 0) {
    return <p className="text-gray-500 mb-3">No education added yet.</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h2 className="text-lg font-semibold mb-3">Education</h2>
      <ul className="space-y-3">
        {educationList.map((edu) => (
          <li
            key={edu.id}
            className="flex justify-between items-start border-b pb-2"
          >
            <div>
              <p className="font-medium">{edu.school_name}</p>
              <p className="text-gray-500 text-sm">
                {edu.degree} - {edu.field_of_study}
              </p>
              <p className="text-gray-400 text-sm">
                {edu.start_year} - {edu.is_current ? "Present" : edu.end_year}
              </p>
              {edu.gpa && (
                <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>
              )}
              {edu.description && (
                <p className="text-sm text-gray-500 italic mt-1">
                  {edu.description}
                </p>
              )}
            </div>

            {/* ✏️ Edit Button */}
            <button
              onClick={() => onEdit(edu)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              ✎ Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
