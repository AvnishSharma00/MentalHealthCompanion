import React from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, User, MessageCircleHeart, Calendar } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-indigo-700" />,
      title: "AI-Based Support",
      desc: "Personalized AI coping tips & journaling suggestions.",
    },
    {
      icon: <User className="w-6 h-6 text-indigo-700" />,
      title: "Verified Therapists",
      desc: "Connect with licensed professionals in one click.",
    },
    {
      icon: <Calendar className="w-6 h-6 text-indigo-700" />,
      title: "Easy Scheduling",
      desc: "Book & manage sessions without hassle.",
    },
    {
      icon: <MessageCircleHeart className="w-6 h-6 text-indigo-700" />,
      title: "Anonymous Community",
      desc: "Safe space to share and receive peer support.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white font-sans overflow-hidden">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-6 py-4 backdrop-blur-lg bg-white/10 border-b border-white/20 z-10 relative">
        <h1 className="text-3xl font-bold tracking-wider">MindCare</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-full bg-white text-indigo-700 font-semibold hover:bg-gray-100 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/userSignUp")}
            className="px-4 py-2 rounded-full bg-white text-indigo-700 font-semibold hover:bg-gray-100 transition"
          >
            Sign Up
          </button>
          <button
            onClick={() => navigate("/TherapistSignUp")}
            className="px-4 py-2 rounded-full border border-white text-white hover:bg-white/20"
          >
            Therapist
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="text-center pt-20 pb-16 px-4 z-10 relative">
        <h2 className="text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-md mb-6">
          Heal. Grow. Thrive.
        </h2>
        <p className="text-xl text-gray-100 max-w-2xl mx-auto mb-8">
          MindCare is your personal mental wellness partner — combining AI tools, therapist support, and a kind community.
        </p>
        <button
          onClick={() => navigate("/signup")}
          className="bg-white text-indigo-700 font-bold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          Start Your Journey
        </button>
      </section>

      {/* FEATURES */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto px-6 py-10 z-10 relative">
        {features.map((item, i) => (
          <div
            key={i}
            className="flex items-start space-x-4 bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 hover:bg-white/20 transition"
          >
            <div className="p-2 bg-white rounded-full">{item.icon}</div>
            <div>
              <h3 className="text-xl font-bold mb-1">{item.title}</h3>
              <p className="text-sm text-gray-100">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* QUOTE */}
      <section className="text-center py-12 px-4 max-w-3xl mx-auto">
        <p className="italic text-lg text-gray-200">
          “Your mental health is a priority. Your inner peace is essential. You deserve to feel okay.”
        </p>
      </section>

      {/* FOOTER */}
      <footer className="bg-white/10 backdrop-blur-sm py-6 px-6 text-sm text-gray-100 border-t border-white/20">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto space-y-4 md:space-y-0">
          <p>© 2025 MindCare</p>
          <div className="space-x-4">
            <a href="#privacy" className="hover:underline">Privacy</a>
            <a href="#terms" className="hover:underline">Terms</a>
            <a href="#contact" className="hover:underline">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
