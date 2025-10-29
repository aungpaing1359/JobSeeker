import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ExperienceList({ profileId, experienceList, setExperienceList, onEdit }) {
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Experience Data
  useEffect(() => {
    if (!profileId) return;

    setLoading(true);
    axios
      .get(
        `http://127.0.0.1:8000/accounts-jobseeker/experience/?profile=${profileId}`,
        { withCredentials: true }
      )
      .then((res) => {
        setExperienceList(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching experience:", err);
        setLoading(false);
      });
  }, [profileId, setExperienceList]);

  if (loading) {
    return (
      <div className="text-gray-500 text-sm italic">Loading experience...</div>
    );
  }

  if (!experienceList || experienceList.length === 0) {
    return <p className="text-gray-500 mb-3">No experience added yet.</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h2 className="text-lg font-semibold mb-3">Experiences</h2>
      <ul className="space-y-3">
        {experienceList.map((exp) => (
          <li
            key={exp.id}
            className="flex justify-between items-center border-b pb-2"
          >
            <div>
              <p className="font-medium">{exp.job_title}</p>
              <p className="text-gray-500 text-sm">
                {exp.company_name} - {exp.position}
              </p>
              <p className="text-gray-400 text-sm">
                {exp.start_date} - {exp.is_current ? "Present" : exp.end_date}
              </p>
              {exp.location && (
                <p className="text-sm text-gray-500">📍 {exp.location}</p>
              )}
              {exp.description && (
                <p className="text-sm text-gray-500 italic mt-1">
                  {exp.description}
                </p>
              )}
            </div>

            <button
              onClick={() => onEdit(exp)}
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
