import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLogin } from "../../context/login-context";
import { Logout } from "../../components/Logout";

export const Header = () => {
  const { isloggedin, role } = useLogin();
  const navigate = useNavigate();
   console.log(role)
  const navClasses = ({ isActive }) =>
    `px-4 py-2 rounded-xl font-medium transition-all duration-300 
    ${
      isActive
        ? "bg-indigo-100 text-indigo-700 shadow-md scale-105"
        : "text-gray-600 hover:bg-gray-100 hover:text-indigo-600"
    }`;

  // Role-based dashboard link
  const getDashboardLink = () => {
    switch (role) {
      case "THERAPIST":
        return (
          <NavLink to="/therapistdashboard" className={navClasses}>
            Therapist Dashboard
          </NavLink>
        );
      case "ADMIN":
        return (
          <NavLink to="/admin" className={navClasses}>
            Admin Dashboard
          </NavLink>
        );
      default:
        return null;
    }
  };

  return (
    <header className="w-full bg-white/80 backdrop-blur-lg shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <div
          className="text-3xl font-extrabold text-indigo-700 cursor-pointer hover:text-indigo-800 transition"
          onClick={() => navigate("/")}
        >
          MindCare
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-4 bg-gray-50 px-3 py-2 rounded-2xl shadow-inner">
          {/* Only USER role sees Home, Therapist, Journal */}
          {isloggedin && role === "USER" && (
            <>
              <NavLink to="/home" className={navClasses}>
                Home
              </NavLink>
              <NavLink to="/therapistdata" className={navClasses}>
                Therapist
              </NavLink>
              <NavLink to="/journal" className={navClasses}>
                Journal
              </NavLink>
            </>
          )}

          {/* Profile is available to all logged in roles */}
          {isloggedin && (
            <NavLink to="/profile" className={navClasses}>
              Profile
            </NavLink>
          )}

          {/* Dashboard (role-based) */}
          {isloggedin && getDashboardLink()}

          {/* Auth */}
          {isloggedin ? (
            <Logout />
          ) : (
            <NavLink
              to="/login"
              className="ml-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-full shadow-md transition-all duration-300"
            >
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
