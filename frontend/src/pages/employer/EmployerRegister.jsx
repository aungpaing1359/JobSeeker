import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEmployerAuth } from "../../hooks/useEmployerAuth";

export default function EmployerRegister() {
  const navigate = useNavigate();
  const { register } = useEmployerAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUser = await register(email, password);
      navigate("/employer/company/detail", { state: { email: newUser.email } });
    } catch (err) {
      console.error(err);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="absolute top-5 left-8 text-2xl font-bold text-blue-900">
        Jobseeker
      </div>

      <div className="bg-blue-50 rounded-2xl shadow-md w-full max-w-md p-8 text-center">
        <p className="text-gray-600 mb-2">
          Are you looking for{" "}
          <Link to="/sign-in" className="text-blue-600">
            a job?
          </Link>
        </p>
        <h2 className="text-2xl font-bold mb-6">Register as an employer</h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <label className="text-sm text-gray-600">
              I accept the Terms & Conditions and Privacy Policy Of Farm Fresh
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Already have your account?{" "}
          <Link
            to="/employer/sign-in"
            className="text-blue-600 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>

      <div className="absolute bottom-4 text-gray-500 text-sm">
        © 2023 Copyright: Jobstreet.com
      </div>
    </div>
  );
}
