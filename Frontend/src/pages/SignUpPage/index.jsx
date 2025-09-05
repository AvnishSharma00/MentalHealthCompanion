import { Fragment, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useLogin } from "../../context/login-context";
import { useNavigate } from "react-router-dom";
import { userSignUp } from "../../Api/loginapi";

export const UserSignup = () => {
    const {email,password,gender,username,dob,loginDispatch}=useLogin()
  const [showPassword, setShowPassword] = useState(false);
  const navigate=useNavigate()
  console.log(email)
  console.log(username)
  console.log(dob)
  console.log(password)
  console.log(gender)
  const userData={
    email,username,gender,password, dateOfBirth: dob
  }
  const handleSubmit=async(e)=>{
    e.preventDefault(); 
    try{
      const data=await userSignUp(userData);
      console.log(data)
      navigate("/login")  
    }catch(err){
      console.log(err)
    }
  }
  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <Fragment>
      <Header />
      <div className="min-h-fit bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-12">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
          <h2 className="text-4xl font-bold text-center text-indigo-700 mb-8">
            Sign Up
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit} >
            {/* Email */}
            <input
              type="email"
              value={email}
              onChange={(e)=>loginDispatch({
                type:'EMAIL',
                payload:e.target.value
              })}
              required
              placeholder="Email"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />

            {/* Username */}
            <input
              type="text"
              value={username}
              onChange={(e)=>loginDispatch({
                type:'USERNAME',
                payload:e.target.value
              })}
              placeholder="Username"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e)=>loginDispatch({
                    type:'PASSWORD',
                    payload:e.target.value
                })}
                placeholder="Password"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
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

            {/* Date of Birth */}
            <input
              type="date"
              value={dob}
              onChange={(e)=>loginDispatch({
                type:'DOB',
                payload:e.target.value
              })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />

            {/* Gender */}
            <select
            value={gender}
            onChange={(e)=>loginDispatch({
              type:'GENDER',
              payload:e.target.value
            })}
             className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition">
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition"
            >
              Sign Up
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="px-3 text-gray-500 text-sm font-medium">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Google Signup */}
          <button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-3 hover:shadow-md transition bg-white"
          >
            <FcGoogle size={24} />
            <span className="text-gray-700 font-medium">
              login with Google
            </span>
          </button>
        </div>
      </div>
      <Footer />
    </Fragment>
  );
};
