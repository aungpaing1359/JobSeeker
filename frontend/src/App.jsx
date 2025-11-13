import React from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/homepage/Home";

import JobSearch from "./pages/jobsearch/JobSearch";
import JobSearchAll from "./pages/jobsearch/JobSearchAll";
import JobDetailView from "./pages/jobsearch/JobDetailView";

import SaveJobs from "./components/Navbar/SaveJobs";
import SavedJobDetail from "./components/Navbar/SaveJobDetail";
import JobApplications from "./components/Navbar/JobApplication";
import JobApplicationDetail from "./components/Navbar/JobApplicationDetail";

import Profile from "./pages/profile/Profile";

import Companies from "./pages/companies/Companies";
import CompanyAbout from "./pages/companies/CompanyAbout";

// Auth JobSeeker
import SignIn from "./pages/jobseeker/SignIn";
import VerifyOTP from "./pages/jobseeker/VerifyOTP";

// ProfileMe for user
import ProfileMe from "./pages/profile/ProfileMe";
import EditProfile from "./pages/profile/editprofile/EditProfile";

// Auth Employer
import EmployerSignIn from "./pages/employer/EmployerSignIn";
import EmployerRegister from "./pages/employer/EmployerRegister";
import EmployerCompanyDetail from "./pages/employer/EmployerCompanyDetail";

// Test Page
// import RateLimitTest from "./pages/RateLimitTest";
// import RateLimitDemo from "./pages/RateLimitDemo";

// Employer Layout & Pages
import EmployerDashboardLayout from "./pages/employer/dashboard/EmployerDashboard";
import Overview from "./pages/employer/dashboard/OverView";

import MyJobs from "./pages/employer/jobs-page/MyJobs";
import EditJob from "./pages/employer/jobs-page/EditJob";
import PostJob from "./pages/employer/jobs-page/PostJob";
import JobDetail from "./components/employer/jobs/JobDetail";

import JobCategoryListPage from "./pages/employer/job-categories-page/JobCategoryListPage";
import JobCategoryCreatePage from "./pages/employer/job-categories-page/JobCategoryCreatePage";
import JobCategoryEditPage from "./pages/employer/job-categories-page/JobCategoryEditPage";
import JobCategoryDetailPage from "./pages/employer/job-categories-page/JobCategoryDetailPage";

import EmployerProfile from "./pages/employer/profile/EmployerProfile";
import EmployerProfileEditPage from "./pages/employer/profile/EmployerProfileEditPage";

import JobApplication from "./pages/employer/job-application/JobApplication";
import JobApplicationProfileDetail from "./pages/employer/job-application/JobApplicationProfileDetail";

// ✅ Auth Context import
import { AuthProvider } from "./context/AuthContext";
// Employer Auth Context
import { EmployerAuthProvider } from "./context/EmployerAuthContext";
// Notification Auth Context
import { NotificationProvider } from "./context/NotificationContext";
// Apply Auth
import { JobApplyProvider } from "./context/JobApplyContext";

// ProtectedRoute
import ProtectedRoute from "./components/ProtectedRoute";

// Toaster
import { Toaster } from "react-hot-toast";

function App() {
  return (
    // ✅ Wrap whole app with AuthProvider

    <AuthProvider>
      <EmployerAuthProvider>
        <NotificationProvider>
          <JobApplyProvider>
            <>
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  {/* Home */}
                  <Route index element={<Home />} />

                  <Route path="job-search">
                    <Route index element={<JobSearch />} />
                    <Route path=":id" element={<JobSearch />} />
                    <Route path=":id" element={<JobDetailView />} />
                    <Route path="all" element={<JobSearchAll />} />
                    <Route path="saved" element={<SaveJobs />} />
                    <Route path="saved/:id" element={<SavedJobDetail />} />
                    <Route path="applications" element={<JobApplications />} />
                    <Route
                      path="applications/:id"
                      element={<JobApplicationDetail />}
                    />
                  </Route>

                  <Route path="profile" element={<Profile />} />

                  <Route path="companies" element={<Companies />} />
                  <Route path="companies/:id" element={<CompanyAbout />} />

                  <Route
                    path="profile/me"
                    element={
                      <ProtectedRoute>
                        <ProfileMe />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="profile/me/edit"
                    element={
                      <ProtectedRoute>
                        <EditProfile />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* Jobseeker Auth */}
                <Route path="sign-in" element={<SignIn />} />
                <Route path="verify" element={<VerifyOTP />} />

                {/* Employer Auth */}
                <Route path="employer/sign-in" element={<EmployerSignIn />} />
                <Route
                  path="employer/register"
                  element={<EmployerRegister />}
                />
                <Route
                  path="employer/company/detail"
                  element={<EmployerCompanyDetail />}
                />

                {/* Employer Auth */}
                <Route
                  path="/employer/dashboard"
                  element={<EmployerDashboardLayout />}
                >
                  <Route index element={<Overview />} />

                  {/* job */}
                  <Route path="my-jobs" element={<MyJobs />} />
                  <Route path="job-create" element={<PostJob />} />
                  <Route path="my-jobs/:id/edit" element={<EditJob />} />
                  <Route path="my-jobs/:id/detail" element={<JobDetail />} />

                  {/* job-category */}
                  <Route
                    path="job-category"
                    element={<JobCategoryListPage />}
                  />
                  <Route
                    path="job-category/create"
                    element={<JobCategoryCreatePage />}
                  />
                  <Route
                    path="job-categories/:id/edit"
                    element={<JobCategoryEditPage />}
                  />
                  <Route
                    path="job-categories/:id"
                    element={<JobCategoryDetailPage />}
                  />

                  {/* Profile */}
                  <Route path="profile" element={<EmployerProfile />} />
                  <Route
                    path="profile/edit"
                    element={<EmployerProfileEditPage />}
                  />

                  {/* Application */}
                  <Route path="applications" element={<JobApplication />} />
                  <Route
                    path="applications/:id"
                    element={<JobApplicationProfileDetail />}
                  />
                </Route>
              </Routes>

              <Toaster position="top-center" reverseOrder={false} />
            </>
          </JobApplyProvider>
        </NotificationProvider>
      </EmployerAuthProvider>
    </AuthProvider>
  );
}

export default App;
