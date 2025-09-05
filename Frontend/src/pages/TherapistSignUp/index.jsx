import { Fragment, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {  Link, useNavigate } from "react-router-dom";
import { useLogin } from "../../context/login-context";
import { therapistSignUp } from "../../Api/loginapi";
import { TherapistDetails } from "../../components/TherapistDetail";

export const TherapistSignUp = () => {
  const navigate=useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const {  email,
        password,
        username,
        gender,
        dob,
        phone,
        role,
        isloggedin,
        specialization,
        licenseNumber,
        contactNumber,
        qualification,loginDispatch}=useLogin()
        console.log(email)
        console.log(password)
        console.log(gender)
        console.log(username)
        console.log(specialization)
        console.log(licenseNumber)
        console.log(qualification)
        console.log(contactNumber)
        console.log(dob)
       const therapistData={
        email,name:username,gender,password, dateOfBirth: dob,specialization,qualification,contactNumber,licenseNumber
       }
        const onHandleSumbit=async(e)=>{
          e.preventDefault();
          try{
           const data=await therapistSignUp(therapistData)
           console.log(data)
           navigate("/login")
          }catch(err){
            console.log(err)
          }
        }

  return (
    <Fragment>
      <Header />
      <div className="min-h-fit bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center py-16 px-6">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-3xl border border-gray-100">
          <h2 className="text-4xl font-bold text-center text-indigo-700 mb-10">
            Therapist Sign Up
          </h2>

          <form className="space-y-6" onSubmit={onHandleSumbit}>
            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e)=>loginDispatch({
                    type:'EMAIL',
                    payload:e.target.value
                })}
                required
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e)=>loginDispatch({
                    type:'PASSWORD',
                    payload:e.target.value
                  })}
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-indigo-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={22} />
                  ) : (
                    <AiOutlineEye size={22} />
                  )}
                </span>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={username}
                placeholder="Enter your full name"
                onChange={(e)=>loginDispatch({
                    type:'USERNAME',
                    payload:e.target.value
                })}
                required
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Date of Birth + Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e)=>loginDispatch({
                    type:'DOB',
                    payload:e.target.value
                  })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Gender</label>
                <select
                value={gender}
                onChange={(e)=>loginDispatch({
                    type:'GENDER',
                    payload:e.target.value
                })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Specialization</label>
              <input
                type="text"
                value={specialization}
                placeholder="Your area of expertise"
                 onChange={(e)=>loginDispatch({
                    type:'SPECIALIZATION',
                    payload:e.target.value
                })}
                required
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* License Number + Contact Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                
                <label className="block text-gray-700 font-medium mb-1">License Number</label>
                <input
                  type="text"
                  value={licenseNumber}
                  placeholder="Enter license number"
                   onChange={(e)=>loginDispatch({
                    type:'LICENSENUMBER',
                    payload:e.target.value
                })}
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Contact Number</label>
                <input
                  type="text"
                  value={contactNumber}
                  placeholder="Enter contact number"
                   onChange={(e)=>loginDispatch({
                    type:'CONTACTNUMBER',
                    payload:e.target.value
                })}
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            {/* Qualification */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Qualification</label>
              <input
                type="text"
                value={qualification}
                placeholder="Your qualification"
                onChange={(e)=>loginDispatch({
                    type:'QUALIFICATION',
                    payload:e.target.value
                })}
                required
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition transform hover:scale-[1.01] shadow-lg"
            >
              Sign Up
            </button>
          </form>

          {/* Already have account */}
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </Fragment>
  );
};
