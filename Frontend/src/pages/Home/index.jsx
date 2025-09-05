// src/pages/Homepage.jsx
import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getEntries ,deleteJournalEntry} from "../../Api/JournalEntryApi";
import { FileText, Settings, Trash2 } from "lucide-react"; // added Trash2 icon
import CreateJournal from "../../components/CreateJournal";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Logout } from "../../components/Logout";

const Homepage = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [showCreateJournal, setShowCreateJournal] = useState(false);
  const [error, setError] = useState();

  const getclick = async () => {
    try {
      const data = await getEntries();
      setEntries(data);
      setShowCreateJournal(false);
    } catch (err) {
      console.log(err);
      setError(err);
      alert("Failed to fetch entries.");
    }
  };

  useEffect(() => {
    getclick();
  }, []);

 ;

  const handleDelete = async (id) => {
    try {
      await deleteJournalEntry(id);
        getclick()
    } catch (err) {
      console.error(err);
      alert("Failed to delete entry.");
    }
  };

  const getMoodColor = (mood) => {
    switch (mood) {
      case "HAPPY":
        return "bg-green-100 text-green-700";
      case "SAD":
        return "bg-blue-100 text-blue-700";
      case "ANXIOUS":
        return "bg-yellow-100 text-yellow-700";
      case "ANGRY":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Fragment>
      
      <div className="min-h-screen flex bg-indigo-50">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg flex flex-col justify-between">
          <div>
            <nav className="flex flex-col mt-6 space-y-2">
              <button
                onClick={() => navigate("/journal")}
                className="flex items-center gap-2 px-6 py-3 hover:bg-indigo-100 transition rounded-lg"
              >
                <FileText className="w-5 h-5" /> Create Journal Entry
              </button>
              <button
                onClick={getclick}
                className="flex items-center gap-2 px-6 py-3 hover:bg-indigo-100 transition rounded-lg"
              >
                <FileText className="w-5 h-5" /> My Entries
              </button>
              <button
                onClick={() => alert("Profile Settings")}
                className="flex items-center gap-2 px-6 py-3 hover:bg-indigo-100 transition rounded-lg"
              >
                <Settings className="w-5 h-5" /> Profile Settings
              </button>
            </nav>
          </div>

          <div className="p-6">
           <Logout/>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <h1 className="text-3xl font-bold text-indigo-700">Welcome Back!</h1>
            <p className="text-gray-600">Your personal journal dashboard</p>
          </header>

          {showCreateJournal ? (
            <CreateJournal />
          ) : (
            <section>
              {entries.length === 0 ? (
                <p className="text-gray-500">
                  No entries yet. Click "My Entries" to fetch them.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-rows-1 gap-4">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h2 className="font-semibold text-indigo-700 text-lg">
                          {entry.title || "Untitled Entry"}
                        </h2>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getMoodColor(
                            entry.mood
                          )}`}
                        >
                          {entry.mood}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{entry.content}</p>
                      {/* Timestamp on left, Delete button on right */}
                      <div className="flex justify-between items-center">
                        <p className="text-gray-400 text-sm">
                          {new Date(entry.timestamp).toLocaleString()}
                        </p>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </main>
      </div>
      
    </Fragment>
  );
};

export default Homepage;
