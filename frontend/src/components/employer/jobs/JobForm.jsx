import React, { useEffect, useState } from "react";
import { createJob, updateJob, getJobDetail } from "../../../utils/api/jobAPI";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useEmployerAuth } from "../../../hooks/useEmployerAuth";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function JobForm({ jobId }) {
  const navigate = useNavigate();
  const { employer } = useEmployerAuth();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    employer: "",
    job_type: "",
    location: "",
    salary: "",
    deadline: "",
    description: "",
    category: "",
    is_active: true,
    max_applicants: "",
    priority: "NORMAL",
  });
  const [employerName, setEmployerName] = useState("");
  const [loading, setLoading] = useState(false);

  const JOB_TYPE_CHOICES = [
    { value: "FULL", label: "Full-time" },
    { value: "PART", label: "Part-time" },
    { value: "INTERN", label: "Internship" },
    { value: "REMOTE", label: "Remote" },
  ];

  const LOCATION_CHOICES = [
    { value: "MO", label: "MRAUK-U" },
    { value: "MB", label: "MINBRAR" },
    { value: "SIT", label: "SITTWE" },
    { value: "RD", label: "RETHEEDAUNG" },
    { value: "MD", label: "MAUNGDAW" },
    { value: "KP", label: "KYAWTPYHU" },
    { value: "TD", label: "THANDWE" },
    { value: "TG", label: "TOUNGUP" },
    { value: "AN", label: "ANN" },
    { value: "PNG", label: "PONNAGYUN" },
    { value: "KT", label: "KYAUKTAW" },
    { value: "RM", label: "RAMREE" },
    { value: "MA", label: "MANAUNG" },
    { value: "GW", label: "GWA" },
    { value: "PT", label: "PAUKTAW" },
    { value: "BTD", label: "BUTHIDAUNG" },
    { value: "MBN", label: "MYEBON" },
  ];

  const PRIORITY_CHOICES = [
    { value: "NORMAL", label: "Normal" },
    { value: "FEATURED", label: "Featured" },
    { value: "URGENT", label: "Urgent" },
  ];

  useEffect(() => {
    if (employer) {
      setFormData((prev) => ({ ...prev, employer: employer.id }));
      setEmployerName(employer.company_name || employer.name || employer.email);
    }
  }, [employer]);

  useEffect(() => {
    if (jobId) {
      getJobDetail(jobId).then((res) => {
        const data = res.data;
        setFormData({
          title: data.title || "",
          employer: data.employer?.id || employer?.id || "",
          job_type: data.job_type || "",
          location: data.location || "",
          salary: data.salary || "",
          deadline: data.deadline || "",
          description: data.description || "",
          category: data.category || "",
          is_active: data.is_active ?? true,
          max_applicants: data.max_applicants || "",
          priority: data.priority || "NORMAL",
        });
        setEmployerName(
          data.employer?.company_name ||
            data.employer?.name ||
            data.employer ||
            "Unknown Employer"
        );
      });
    }
  }, [jobId, employer]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/job/job-categories/")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Category fetch error:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (jobId) {
        await updateJob(jobId, formData);
        toast.success("✅ Job updated successfully!");
      } else {
        await createJob(formData);
        toast.success("✅ Job created successfully!");
      }
      navigate("/employer/dashboard/my-jobs");
    } catch (err) {
      console.error(err);
      toast.error("❌ Error saving job");
    } finally {
      setLoading(false);
    }
  };

  // description quillModuls
  // ✅ Full toolbar configuration
  const quillModules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["blockquote", "code-block"],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list", // ✅ keep only 'list', remove 'bullet'
    "indent",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
    "video",
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800 text-lg"
          >
            ←
          </button>
          <h1 className="text-lg font-semibold text-gray-700">
            {jobId ? "Edit Job Post" : "Create Job Post"}
          </h1>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
        >
          {loading ? "Saving..." : jobId ? "Update Job" : "Add Job Post"}
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search"
          className="flex-1 bg-white border rounded-md p-3 shadow-sm focus:outline-none"
        />
        <select className="w-full md:w-48 bg-white border rounded-md p-3 shadow-sm">
          <option>All Status</option>
          <option>Active</option>
          <option>Closed</option>
        </select>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 space-y-6 mx-auto"
      >
        {/* Employer Info */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Posted By</p>
          <p className="text-lg font-semibold text-gray-800 mt-1">
            {employerName || "No employer set"}
          </p>
        </div>

        {/* Job Title */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Job Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Job Type + Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Job Type
            </label>
            <select
              name="job_type"
              value={formData.job_type}
              onChange={handleChange}
              className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Select Job Type --</option>
              {JOB_TYPE_CHOICES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Location + Salary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Location
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Select Location --</option>
              {LOCATION_CHOICES.map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Salary Range
            </label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter salary"
            />
          </div>
        </div>

        {/* Max Applicants + Deadline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Maximum Applicants
            </label>
            <input
              type="number"
              name="max_applicants"
              value={formData.max_applicants}
              onChange={handleChange}
              className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter max applicants"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Post Date (Deadline)
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Priority + Active */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PRIORITY_CHOICES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3 mt-7">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600"
            />
            <label className="text-gray-700 font-medium">Active</label>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description
          </label>

          <ReactQuill
            theme="snow"
            value={formData.description}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, description: value }))
            }
            modules={quillModules}
            formats={quillFormats}
            placeholder="Write detailed job description here..."
            className="bg-white rounded-lg border border-gray-300 min-h-[200px] mb-10"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-md"
          >
            {loading ? "Saving..." : jobId ? "Update Job" : "Create Job"}
          </button>
        </div>
      </form>
    </div>
  );
}
