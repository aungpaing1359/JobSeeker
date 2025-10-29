import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Edit,
  Mail,
  MapPin,
  Building2,
  Phone,
  Users,
  Calendar,
  AtSign,
  AlignLeft,
} from "lucide-react";

export default function EmployerProfilePage() {
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState(null);
  const [showUploadButton, setShowUploadButton] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [description, setDescription] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const getCSRFToken = () => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];
    return cookieValue;
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem("access");
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/accounts-employer/employer/profile/",
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "X-CSRFToken": getCSRFToken(),
          },
        }
      );

      const emp = res.data.employer_profile[0];
      setProfile(emp);
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("employerUser");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setEmail(parsedUser.email);
    }

    fetchProfile();
  }, []);

  const handleAvatarClick = () => setShowUploadButton(true);
  const handleUploadClick = () => fileInputRef.current.click();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const token = localStorage.getItem("access");
    const formData = new FormData();
    formData.append("logo", file);
    try {
      await axios.patch(
        `http://127.0.0.1:8000/accounts-employer/employer/profile-update/${profile.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-CSRFToken": getCSRFToken(),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      await fetchProfile();
      setShowUploadButton(false);
    } catch (err) {
      console.error("Image upload error:", err);
    }
  };

  // ✅ Description save handler
  const handleDescriptionSave = async () => {
    if (!profile?.id) return;

    const token = localStorage.getItem("access");
    const csrfToken = getCSRFToken();
    const formData = new FormData();
    formData.append("description", description);

    try {
      const res = await axios.patch(
        `http://127.0.0.1:8000/accounts-employer/employer/profile-update/${profile.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            "X-CSRFToken": csrfToken,
          },
        }
      );
      console.log("✅ Description updated:", res.data);
      await fetchProfile(); // Refresh UI
      setEditMode(false);
    } catch (err) {
      console.error(
        "❌ Description update error:",
        err.response?.data || err.message
      );
    }
  };

  if (!profile) return <p className="p-6 text-gray-600">Loading...</p>;

  const profileFields = [
    {
      label: "Email",
      value: email,
      icon: <Mail className="w-5 h-5 text-blue-500" />,
    },
    {
      label: "Founded Year",
      value: profile.founded_year,
      icon: <Calendar className="w-5 h-5 text-indigo-500" />,
    },
    {
      label: "Industry",
      value: profile.industry,
      icon: <Building2 className="w-5 h-5 text-purple-500" />,
    },
    {
      label: "Company Name",
      value: profile.business_name,
      icon: <Building2 className="w-5 h-5 text-gray-700" />,
    },
    {
      label: "Phone",
      value: profile.phone,
      icon: <Phone className="w-5 h-5 text-teal-500" />,
    },
    {
      label: "City",
      value: profile.city,
      icon: <MapPin className="w-5 h-5 text-red-500" />,
    },
    {
      label: "Company Size",
      value: profile.size,
      icon: <Users className="w-5 h-5 text-orange-500" />,
    },
    {
      label: "Contact Email",
      value: profile.contact_email,
      icon: <AtSign className="w-5 h-5 text-pink-500" />,
    },
  ];

  return (
    <div className="bg-white flex justify-center items-start py-10">
      <main className="w-full p-6">
        <h1 className="text-xl sm:text-2xl font-semibold mb-6 gray-text-custom">
          Employee Profile
        </h1>

        <section className="relative rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div
              className="relative w-28 h-28 flex items-center justify-center"
              onClick={handleAvatarClick}
            >
              {/* Avatar Circle */}
              <div
                className="w-28 h-28 rounded-full flex items-center justify-center text-white text-3xl font-bold cursor-pointer hover:opacity-90 transition shadow-md border border-gray-200"
                style={{
                  backgroundColor: profile?.logo ? "transparent" : "#3b82f6",
                }}
              >
                {profile?.logo ? (
                  <img
                    src={`http://127.0.0.1:8000${profile.logo}`}
                    alt={profile.first_name || "Avatar"}
                    className="w-28 h-28 rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "";
                    }}
                  />
                ) : (
                  profile?.first_name?.charAt(0).toUpperCase() || "U"
                )}
              </div>

              {/* ✅ Upload Button — click avatar ပေါ်မှပေါ်လာမယ် */}
              {showUploadButton && (
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 animate-fadeIn">
                  <button
                    onClick={handleUploadClick}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow-md hover:bg-blue-700 transition"
                  >
                    📤 Upload Photo
                  </button>
                </div>
              )}

              {/* Hidden File Input */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Info Section */}
            <div className="flex-1 w-full">
              <h2 className="text-2xl font-semibold text-gray-800">
                {profile.first_name} {profile.last_name}
              </h2>
              <p className="text-base text-gray-500 mt-1">
                Website:{" "}
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {profile.website || "N/A"}
                </a>
              </p>

              <hr className="my-5" />

              {/* Info Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profileFields.map((field, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    {field.icon}
                    <span className="font-medium">{field.label}:</span>
                    <span className="text-base">{field.value ?? "N/A"}</span>
                  </div>
                ))}
              </div>

              {/* ✅ Description Section */}
              <div className="mt-12">
                <h3 className="flex items-center justify-between gap-2 text-lg font-semibold text-gray-800 mb-2">
                  <span className="flex items-center gap-2">
                    <AlignLeft className="w-5 h-5 text-blue-600" />
                    Company Description
                  </span>

                  {!editMode && (
                    <button
                      onClick={() => {
                        setEditMode(true);
                        setDescription(profile.description || "");
                      }}
                      className="gray-text-custom hover-blue cursor-pointer"
                    >
                      <Edit size={26} />
                    </button>
                  )}
                </h3>

                {editMode ? (
                  <div className="space-y-3">
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                      placeholder="Enter company description..."
                      className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    ></textarea>

                    <div className="flex gap-3">
                      <button
                        onClick={handleDescriptionSave}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditMode(false)}
                        className="px-4 py-2 border border-gray-400 text-gray-600 text-sm rounded-md hover:bg-gray-100 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 leading-relaxed border rounded-md p-4 bg-gray-50">
                    {profile.description
                      ? profile.description
                      : "No description provided."}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Edit Icon */}
          <div
            onClick={() =>
              navigate("/employer/dashboard/profile/edit", {
                state: { profile: { ...profile, id: profile.id } },
              })
            }
            className="absolute top-4 right-4 gray-text-custom hover-blue cursor-pointer"
          >
            <Edit size={26} />
          </div>
        </section>
      </main>
    </div>
  );
}
