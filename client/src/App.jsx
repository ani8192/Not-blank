import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { setCredentials } from "./features/auth/authSlice";

import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import OTPReset from "./pages/OTPReset";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Verify from "./pages/Verify";

// Pages
import Courses from "./pages/Courses";
import Assignments from "./pages/Assignments";
import Marks from "./pages/Marks";
import Profile from "./pages/Profile";
import MyCourses from "./pages/MyCourses";
import JoinCourse from "./pages/JoinCourse";
import CourseDetail from "./pages/CourseDetail";
import CourseStudents from "./pages/CourseStudents";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  // restore user after refresh / new tab
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      dispatch(setCredentials({ user, accessToken: token }));
    }

    setLoading(false);
  }, [dispatch]);

  // wait until auth restore completes
  if (loading) return null;

  const isLoggedIn = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Navbar />

      {/* 🔥 Toast Notifications */}
      <ToastContainer position="top-right" autoClose={2000} />

      <Routes>
        {/* Smart Default Route */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-otp" element={<OTPReset />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify/:token" element={<Verify />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-courses"
          element={
            <ProtectedRoute>
              <MyCourses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/join"
          element={
            <ProtectedRoute>
              <JoinCourse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <Courses user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/course/:id"
          element={
            <ProtectedRoute>
              <CourseDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/course/:id/students"
          element={
            <ProtectedRoute>
              <CourseStudents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assignments"
          element={
            <ProtectedRoute>
              <Assignments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/marks"
          element={
            <ProtectedRoute>
              <Marks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
