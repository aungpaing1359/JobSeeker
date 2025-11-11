import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, XCircle, CheckCircle, Handshake, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function ShortlistApplications() {
  const [shortlisted, setShortlisted] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch shortlisted applications
  const fetchShortlisted = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/application/employer/application/shortlist/",
        { withCredentials: true }
      );
      setShortlisted(res.data.shorlist_apps || []);
    } catch (error) {
      console.error("Error fetching shortlist:", error);
      toast.error("Failed to load shortlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShortlisted();
  }, []);

  return (
    <div className="bg-[#eef5fa] min-h-screen p-6 relative">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <CheckCircle className="text-green-500" /> Shortlisted Applications
      </h2>

      <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-gray-700 font-semibold text-base">
            Shortlisted Candidates
          </h3>
        </div>

        {loading ? (
          <p className="text-center py-8 text-gray-500">Loading...</p>
        ) : shortlisted.length === 0 ? (
          <p className="text-center py-8 text-gray-500">
            No shortlisted applications found.
          </p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-[#f9fafc] text-gray-600">
              <tr>
                <th className="py-3 px-4 text-sm font-semibold">No</th>
                <th className="py-3 px-4 text-sm font-semibold">Name</th>
                <th className="py-3 px-4 text-sm font-semibold">Email</th>
                <th className="py-3 px-4 text-sm font-semibold">Job Title</th>
                <th className="py-3 px-4 text-sm font-semibold">Date</th>
                <th className="py-3 px-4 text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {shortlisted.map((app, i) => (
                <tr
                  key={app.id}
                  className="border-t border-gray-100 text-gray-700 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 text-sm">{i + 1}</td>
                  <td className="py-3 px-4 text-sm">{app.jobseeker_name}</td>
                  <td className="py-3 px-4 text-sm">{app.jobseeker_email}</td>
                  <td className="py-3 px-4 text-sm">{app.job?.title}</td>
                  <td className="py-3 px-4 text-sm">
                    {new Date(app.applied_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/employer/dashboard/applications/${app.id}`}
                        className="text-blue-500 hover:text-blue-700 flex items-center gap-1 hover:underline"
                      >
                        <Eye size={16} /> View
                      </Link>
                      <button
                        onClick={() => toast("Feature coming soon")}
                        className="text-red-500 hover:text-red-700 flex items-center gap-1 hover:underline"
                      >
                        <Trash2 size={16} /> Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
