// src/components/Footer.jsx
import React from "react";
import { FaTwitter, FaInstagram, FaFacebook } from "react-icons/fa";

  const Footer = () => {
  return (
    <footer className="w-full bg-white/10 backdrop-blur-md border-t  border-gray-300 
    " >
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-700">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-indigo-700">MindCare</h1>
          <span className="text-sm text-gray-500">© 2025</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <a href="#home" className="hover:text-indigo-600 transition">Home</a>
          <a href="#journal" className="hover:text-indigo-600 transition">Journal</a>
          <a href="#profile" className="hover:text-indigo-600 transition">Profile</a>
          <a href="#contact" className="hover:text-indigo-600 transition">Contact</a>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4 text-gray-600">
          <a href="#twitter" className="hover:text-indigo-600 transition"><FaTwitter size={18} /></a>
          <a href="#facebook" className="hover:text-indigo-600 transition"><FaFacebook size={18} /></a>
          <a href="#instagram" className="hover:text-indigo-600 transition"><FaInstagram size={18} /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
