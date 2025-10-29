import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapPin, Briefcase, DollarSign, CalendarDays } from "lucide-react";
import { CiMaximize1 } from "react-icons/ci";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ApplyModal from "../../components/Navbar/ApplyModal";
import { toast } from "react-hot-toast";

export default function JobDetailView({ job, isMaximized, onToggleMaximize }) {
  const [isApplying, setIsApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Profile and related data
  const [profile, setProfile] = useState(null);
  const [skillList, setSkillList] = useState([]);
  const [languageList, setLanguageList] = useState([]);
  const [educationList, setEducationList] = useState([]);
  const [experienceList, setExperienceList] = useState([]);
  const [resumeList, setResumeList] = useState([]);

  // ✅ CSRF token helper
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + "=")) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  // ✅ Check if job already applied
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      if (!token || !job?.id) return;

      try {
        const csrftoken = getCookie("csrftoken");
        const res = await axios.get(
          "http://127.0.0.1:8000/application/application/apply/jobs/list/",
          {
            headers: {
              "X-CSRFToken": csrftoken,
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        // ✅ ဒီမှာ job.id နဲ့ ချိန်စစ်
        const found = res.data.apply_jobs.some(
          (item) => item.job.id === job.id
        );
        setIsApplied(found);
      } catch (err) {
        console.error("❌ Check applied failed:", err);
      }
    };

    fetchAppliedJobs();
  }, [job?.id, token]);

  // ✅ Fetch profile and related info
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileRes = await axios.get(
          "http://127.0.0.1:8000/accounts-jobseeker/jobseekerprofile/",
          { withCredentials: true }
        );
        const prof =
          Array.isArray(profileRes.data) && profileRes.data.length > 0
            ? profileRes.data[0]
            : null;
        setProfile(prof);

        if (prof?.id) {
          // Fetch Skills
          const skillsRes = await axios.get(
            `http://127.0.0.1:8000/accounts-jobseeker/skill/?profile=${prof.id}`,
            { withCredentials: true }
          );
          setSkillList(skillsRes.data);

          // Fetch Languages
          const langRes = await axios.get(
            `http://127.0.0.1:8000/accounts-jobseeker/language/?profile=${prof.id}`,
            { withCredentials: true }
          );
          setLanguageList(langRes.data);

          // Fetch Education
          const eduRes = await axios.get(
            `http://127.0.0.1:8000/accounts-jobseeker/education/?profile=${prof.id}`,
            { withCredentials: true }
          );
          setEducationList(eduRes.data);

          // Fetch Experience
          const expRes = await axios.get(
            `http://127.0.0.1:8000/accounts-jobseeker/experience/?profile=${prof.id}`,
            { withCredentials: true }
          );
          setExperienceList(expRes.data);

          // Fetch Resume
          const resumeRes = await axios.get(
            `http://127.0.0.1:8000/accounts-jobseeker/resume/?profile=${prof.id}`,
            { withCredentials: true }
          );
          setResumeList(resumeRes.data);
        }
      } catch (err) {
        console.error("❌ Error fetching profile data:", err);
      }
    };

    fetchProfileData();
  }, []);

  // ✅ Open Apply Modal or redirect if profile incomplete
  const handleOpenModal = () => {
    if (!token) {
      toast.error("⚠️ Please sign in to apply for jobs.");
      navigate("/sign-in");
      return;
    }

    if (!job?.is_active || isApplied || !token) return;

    const missingProfileData =
      !profile?.id ||
      skillList.length === 0 ||
      languageList.length === 0 ||
      educationList.length === 0 ||
      experienceList.length === 0 ||
      resumeList.length === 0;

    if (missingProfileData) {
      toast.error("⚠️ Please complete your profile before applying.");
      navigate("/profile/me");
      return;
    }

    setIsModalOpen(true);
  };

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h4 className="font-semibold text-lg">Choose a job you like</h4>
        <p className="text-sm text-gray-500 mt-2">Detail will appear here</p>
      </div>
    );
  }

  const csrftoken = getCookie("csrftoken");

  async function handleSaveJob(e) {
    e.stopPropagation();
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/application/save/job/${job.id}/`,
        {},
        {
          headers: {
            "X-CSRFToken": csrftoken,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      alert("Job saved successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Failed to save job:", error);
      alert("Failed to save job!");
    }
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{job.title}</h2>
          <p className="text-gray-600">{job.employer || "Unknown Company"}</p>
        </div>
        <button onClick={onToggleMaximize}>
          <CiMaximize1 size={20} className="text-gray-600 cursor-pointer" />
        </button>
      </div>

      {/* Meta Info */}
      <div className="mt-4 space-y-2 text-gray-600 text-sm">
        <p className="flex items-center gap-2">
          <MapPin size={16} /> {job.location || "No location"}
        </p>
        <p className="flex items-center gap-2">
          <Briefcase size={16} /> {job.category_name || "Not specified"}
        </p>
        <p className="flex items-center gap-2">
          <DollarSign size={16} /> ${job.salary || "Negotiable"}
        </p>
        <p className="flex items-center gap-2">
          <CalendarDays size={16} />{" "}
          {job.deadline ? `Deadline: ${job.deadline}` : "No deadline"}
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={handleOpenModal}
          disabled={!job?.is_active || isApplying || isApplied}
          className={`px-6 py-2 rounded-md text-white font-semibold transition-colors duration-200 cursor-pointer ${
            isApplied
              ? "bg-green-600 cursor-not-allowed"
              : isApplying
              ? "bg-blue-400 cursor-wait"
              : job?.is_active
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isApplied ? "✅ Applied" : isApplying ? "Applying..." : "Apply Now"}
        </button>

        <button
          onClick={handleSaveJob}
          className="px-6 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100 cursor-pointer"
        >
          Save
        </button>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        job={job}
        onSuccess={() => setIsApplied(true)}
      />

      {/* Description */}
      <div className="mt-8">
        <div
          className="text-gray-600 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: job.description || "No description available",
          }}
        ></div>
      </div>
    </>
  );
}
