import { createContext, useState, useEffect } from "react";
import { registerEmployer,registerEmployerDetail, signinEmployer, fetchCurrentEmployer, employerLogout, resendVerificationEmail } from "../utils/api/employerAPI";

export const EmployerAuthContext = createContext();

export const EmployerAuthProvider = ({ children }) => {
  const [employer, setEmployer] = useState(() => {
    const saved = localStorage.getItem("employerUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // Sync employer with localStorage
  useEffect(() => {
    if (employer) {
      localStorage.setItem("employerUser", JSON.stringify(employer));
    } else {
      localStorage.removeItem("employerUser");
    }
  }, [employer]);

  // Fetch latest user data from backend
  useEffect(() => {
    const loadEmployer = async () => {
      try {
        if (employer) {
          const data = await fetchCurrentEmployer();
          setEmployer(data);
        }
      } catch (err) {
        console.error("Failed to fetch employer:", err);
      } finally {
        setLoading(false);
      }
    };

    loadEmployer();
  }, []);

  // Register
  const register = async (email, password) => {
    try {
      const data = await registerEmployer(email, password);
      const newUser = { email: data.email, password, is_verified: false };
      setEmployer(newUser);
      return newUser;
    } catch (err) {
      throw err;
    }
  };

   // ✅ Submit company detail
  const submitCompanyDetail = async (formData) => {
    const data = await registerEmployerDetail(formData);
    const updatedEmployer = { ...employer, ...formData, };
    setEmployer(updatedEmployer);
    return updatedEmployer;
  };

   // ✅ Signin with token + CSRF
  const signin = async ({ email, password }) => {
    const data = await signinEmployer({ email, password });
    const userWithToken = {
      id: data.id,
      email: data.email,
      username: data.username,
      is_verified: data.is_verified,
      access: data.access,
      refresh: data.refresh,
    };
    setEmployer(userWithToken);
    localStorage.setItem("employerUser", JSON.stringify(userWithToken));
    return userWithToken;
  };

  // Logout with CSRF + refresh token
  const logout = async () => {
    try {
      if (employer?.refresh) {
        await employerLogout(employer.refresh);
      }
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setEmployer(null);
      localStorage.removeItem("employerUser");
    }
  };

   // Resend verification email
  const resendEmail = async () => {
    try {
      if (employer?.email) {
        await resendVerificationEmail(employer.email);
        alert("Verification email resent!");
      }
    } catch (err) {
      console.error("Failed to resend email:", err);
      alert("Failed to resend verification email.");
    }
  };

  return (
    <EmployerAuthContext.Provider value={{ employer, loading, register, submitCompanyDetail, signin, logout, resendEmail, }}>
      {children}
    </EmployerAuthContext.Provider>
  );
};
