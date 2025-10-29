import { useState, useEffect } from "react";
import axios from "axios";
import { AlertTriangle, Briefcase, CheckCircle, FileText } from "lucide-react";

export default function Overview() {
  const [stats, setStates] = useState([
    {
      title: "Total Job",
      value: 100,
      icon: <Briefcase />,
      color: "border-blue-500",
    },
    {
      title: "Applications",
      value: 150,
      icon: <FileText />,
      color: "border-blue-500",
    },
    {
      title: "Acitve Jobs",
      value: 100,
      icon: <CheckCircle />,
      color: "border-blue-500",
    },
    { title: "Expired Jobs", value: 100, icon: <AlertTriangle /> },
  ]);

  useEffect(() => {
    const fatchData = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/accounts-employer/employer/dashboard/",
          {
            withCredentials: true,
          }
        );

        setStates([
          {
            title: "Total Job",
            value: res.data.total_jobs,
            icon: <Briefcase />,
            color: "border-blue-500",
          },
          {
            title: "Applications",
            value: res.data.total_applications,
            icon: <FileText />,
            color: "border-blue-500",
          },
          {
            title: "Active Jobs",
            value: res.data.active_jobs,
            icon: <CheckCircle />,
          },
          {
            title: "Expried Jobs",
            value: res.data.expired_jobs,
            icon: <AlertTriangle />,
          },
        ]);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };

    fatchData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center"
          >
            <div className={`p-2 rounded-md border ${item.color} mb-2`}>
              {item.icon}
            </div>
            <h2 className="font-semibold">{item.title}</h2>
            <p className="text-2xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
