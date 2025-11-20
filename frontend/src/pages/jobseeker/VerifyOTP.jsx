import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";

const VerifyOTP = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const { loading, message, verifyOTP, resendOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const inputsRef = useRef([]);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  useEffect(() => {
    if (!email) navigate("/sign-in");
  }, [email, navigate]);

  // Handle typing in each digit
  const handleChange = (value, index) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) inputsRef.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(paste)) {
      const pasteArr = paste.split("");
      setCode((prev) => {
        const newCode = [...prev];
        for (let i = 0; i < pasteArr.length; i++) newCode[i] = pasteArr[i];
        return newCode;
      });
      if (paste.length < 6) inputsRef.current[paste.length]?.focus();
    }
  };

  // === VERIFY OTP ===
  const handleVerifyClick = async () => {
    const otp = code.join("");

    if (otp.length < 6) {
      setError("Enter the 6-digit code");
      setCode(["", "", "", "", "", ""]);
      return;
    }

    try {
      await verifyOTP(email, otp);
    } catch (err) {
      const msg = err?.response?.data?.detail || "Invalid verification code.";

      // ⭐ RATE LIMIT ERROR HANDLING
      if (msg.includes("Too many verification attempts")) {
        toast.error(msg, { icon: "⏳" });
        setError(msg);
        return;
      }

      // ⭐ INVALID OTP
      if (msg.includes("Invalid") || msg.includes("incorrect")) {
        setError("Invalid verification code.");
      } else {
        setError(msg);
      }

      setCode(["", "", "", "", "", ""]);
    }
  };

  // === RESEND OTP ===
  const handleResend = async () => {
    setResendLoading(true);
    setResendMsg("");

    const ok = await resendOTP(email);

    if (ok) {
      setResendMsg("A new verification code has been sent to your email.");
    }

    setResendLoading(false);

    setTimeout(() => setResendMsg(""), 5000);
  };

  // hide error after 3s
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // auto-submit when all 6 digits filled
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleVerifyClick();
    }
  }, [code]);

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "Poppins, sans-serif" }}>
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <NavLink to="/" className="text-2xl font-bold custom-blue-text">
            Jobseeker
          </NavLink>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow flex justify-center items-center px-4">
        <div className="bg-blue-50 rounded-xl p-8 w-full max-w-md shadow-md text-center">
          <p className="mb-4">Check your email for a code</p>
          <p className="mb-6 text-sm">
            Enter the 6-digit code sent to {email}
          </p>

          {/* OTP INPUTS */}
          <div className="flex justify-center gap-2 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                ref={(el) => (inputsRef.current[index] = el)}
                className="w-12 h-12 text-center border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                placeholder="-"
              />
            ))}
          </div>

          {/* Verify button */}
          <button
            onClick={handleVerifyClick}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>

          {error && (
            <p className="mt-3 text-sm text-red-600 font-medium">{error}</p>
          )}

          {/* Resend OTP */}
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="mt-4 text-blue-600 text-sm hover:underline disabled:opacity-50"
          >
            {resendLoading ? "Resending..." : "Resend Code"}
          </button>

          {resendMsg && (
            <p className="text-green-600 text-sm mt-2">{resendMsg}</p>
          )}
        </div>
      </main>

      <footer className="h-12 flex items-center justify-center border-t border-gray-200 text-sm text-gray-500">
        ©2023 Jobstreet.com
      </footer>
    </div>
  );
};

export default VerifyOTP;
