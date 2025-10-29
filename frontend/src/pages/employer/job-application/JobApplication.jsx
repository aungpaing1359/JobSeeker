import { Download, Eye, XCircle, CheckCircle, Send } from "lucide-react";

export default function JobApplication() {
  const cards = [
    {
      title: "Submit",
      value: 5,
      color: "text-blue-500",
      icon: <Download size={24} />,
    },
    {
      title: "Review",
      value: 5,
      color: "text-yellow-500",
      icon: <Eye size={24} />,
    },
    {
      title: "Rejected",
      value: 5,
      color: "text-red-500",
      icon: <XCircle size={24} />,
    },
    {
      title: "Accept",
      value: 5,
      color: "text-green-500",
      icon: <CheckCircle size={24} />,
    },
    {
      title: "Submit",
      value: 5,
      color: "text-purple-500",
      icon: <Send size={24} />,
    },
  ];

  return (
    <div className="p-6 bg-[#f3f8fb] min-h-screen">
      {/* Top Summary Boxes */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {cards.map((card, index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow text-center flex flex-col items-center justify-center">
                <div className={`${card.color} mb-2`}>{card.icon}</div>
                <p className={`${card.color} font-medium`}>{card.title}</p>
                <p className="text-2xl font-bold">{card.value}</p>
            </div>
        ))}
      </div>

      {/* Job Application Table */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Job Application</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            View Application
          </button>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-left">
              <th className="py-2 px-3">No</th>
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">Email</th>
              <th className="py-2 px-3">Role</th>
              <th className="py-2 px-3">Receive</th>
              <th className="py-2 px-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(7)].map((_, i) => (
              <tr key={i} className="border-b text-base text-gray-700">
                <td className="py-2 px-3">{i + 1}</td>
                <td className="py-2 px-3">Seeker Name</td>
                <td className="py-2 px-3">seeker@email.com</td>
                <td className="py-2 px-3">Project Manager</td>
                <td className="py-2 px-3">Time</td>
                <td className="py-2 px-3 text-blue-500 cursor-pointer hover:underline">
                  View
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-end items-center gap-2 mt-4">
          <button className="px-3 py-1 bg-blue-500 text-white rounded">
            1
          </button>
          <button className="px-3 py-1 bg-gray-200 rounded">2</button>
          <button className="px-3 py-1 bg-gray-200 rounded">3</button>
          <button className="px-3 py-1 bg-gray-200 rounded">Next &gt;</button>
        </div>
      </div>
    </div>
  );
}
