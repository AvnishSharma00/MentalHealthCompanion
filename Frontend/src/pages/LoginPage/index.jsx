// src/pages/LoginPage.jsx
import { Fragment, useState } from "react";
import { login } from "../../Api/loginapi";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc"; // Google icon
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useLogin } from "../../context/login-context";

function LoginPage() {
  const { email, password, isloggedin, loginDispatch } = useLogin();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // toggle password

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await login({ email, password });
      console.log("Login response:", data);

      if (data && data.role) {
        // ✅ only dispatch when login is actually valid
        loginDispatch({ type: "LOGGED_IN" });
        loginDispatch({ type: "EMAIL", payload: data.email });
        loginDispatch({ type: "ROLE", payload: data.role });

        if (data.role.toUpperCase() === "USER") {
          navigate("/home");
        } else if (data.role.toUpperCase() === "ADMIN") {
          navigate("/Admin");
        } else if (data.role.toUpperCase() === "THERAPIST") {
          navigate("/TherapistDashBoard");
        } else {
          navigate("/");
        }
      } else {
        alert("Invalid credentials.");
      }
    } catch (err) {
      console.error("❌ Login failed:", err);
      alert("Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <Fragment>
      
      <div className="min-h-fit bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-18">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
          <h2 className="text-4xl font-bold text-center text-indigo-700 mb-8">
            Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="text"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                loginDispatch({ type: "EMAIL", payload: e.target.value })
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />

            {/* Password Field with Eye */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  loginDispatch({ type: "PASSWORD", payload: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition pr-12"
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={22} />
                ) : (
                  <AiOutlineEye size={22} />
                )}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="px-3 text-gray-500 text-sm font-medium">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-3 hover:shadow-md transition bg-white"
          >
            <FcGoogle size={24} />
            <span className="text-gray-700 font-medium">
              Sign in with Google
            </span>
          </button>
        </div>
      </div>
      
    </Fragment>
  );
}

export default LoginPage;
