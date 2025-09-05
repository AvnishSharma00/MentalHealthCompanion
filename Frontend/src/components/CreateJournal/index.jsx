// src/components/CreateJournal.jsx
import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJournal } from "../../Api/JournalEntryApi"; // make sure this exists
import Header from "../Header";
import Footer from "../Footer";

const moods = ["HAPPY", "SAD", "ANXIOUS", "ANGRY", "NEUTRAL"];

const CreateJournal = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("NEUTRAL");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content) {
      alert("Content is required!");
      return;
    }
    setLoading(true);
    try {
      await createJournal({ title, content, mood });
      alert("Journal entry created successfully!");
      setTitle("");
      setContent("");
      setMood("NEUTRAL");
      navigate("/home");
    } catch (err) {
      console.error(err);
      alert("Failed to create journal entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
 
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center py-12 px-4">
        <div className="w-full max-w-3xl bg-white backdrop-blur-md bg-opacity-80 rounded-3xl shadow-2xl p-10">
          <h2 className="text-2xl font-extrabold text-indigo-700 mb-4 text-center drop-shadow-sm">
            Write Your Heart Out
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Capture your thoughts, moods, and reflections. Let your mind breathe.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title & Mood in one line */}
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-lg placeholder-gray-400"
              />
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-48 md:w-40 border border-gray-300 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-lg"
              >
                {moods.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              placeholder="Write your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-gray-300 rounded-2xl px-5 py-6 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-lg placeholder-gray-400 h-60 resize-none"
              required
            />

            {/* Centered button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="w-32 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-2xl text-lg shadow-lg transition disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
      
    </Fragment>
  );
};

export default CreateJournal;
