import { Fragment, useEffect, useState } from "react";
import { 
  getAllUserForAdmin, 
  getAllTherapistForAdmin,
  makeUserAdmin,
  rejectOrApprovedApi
} from "../../Api/AdminApi";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

export const Admin = () => {
  const [therapist, setTherapist] = useState([]);
  const [user, setUser] = useState([]);
  const [activeTab, setActiveTab] = useState("user");

  const getUser = async () => {
    try {
      const response = await getAllUserForAdmin();
      setUser(response.data ? response.data : response);
    } catch (err) {
      console.log(err);
    }
  };

  const getTherapist = async () => {
    try {
      const response = await getAllTherapistForAdmin();
      setTherapist(response.data ? response.data : response);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
    getTherapist();
  }, []);

  const handleMakeAdmin = async (userId) => {
    try {
      await makeUserAdmin(userId);
      getUser();
    } catch (err) {
      console.log(err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await rejectOrApprovedApi(id, "APPROVED");
      getTherapist();
    } catch (err) {
      console.log(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectOrApprovedApi(id, "REJECTED");
      getTherapist();
    } catch (err) {
      console.log(err);
    }
  };

  const renderTable = (data, type) => {
    if (!data || data.length === 0)
      return <p className="text-gray-400">No data found</p>;

    const headers = [...Object.keys(data[0]).filter(h => h !== "password"), "Actions"];

    return (
      <div className="overflow-x-auto rounded-2xl shadow-xl backdrop-blur-lg bg-white/70">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs uppercase bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
            <tr>
              {headers.map((h) => (
                <th key={h} className="px-6 py-3 text-left">
                  {h.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.user_id || row.id}
                className="border-b border-gray-200 hover:bg-purple-50 transition"
              >
                {Object.keys(row).filter(h => h !== "password").map((h) => (
                  <td key={h} className="px-6 py-4">
                    {h.toLowerCase().includes("photo") || h.toLowerCase().includes("image") ? (
                      <img
                        src={`http://localhost:8080${row[h]}`} // prepend your backend base URL
                        alt="profile"
                        className="w-12 h-12 rounded-full object-cover shadow"
                      />
                    ) : (
                      String(row[h])
                    )}
                  </td>
                ))}
                <td className="px-6 py-4 text-right space-x-2">
                  {type === "user" ? (
                    <button
                      onClick={() => handleMakeAdmin(row.user_id)}
                      className="px-3 py-1 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg shadow hover:scale-105 transition"
                    >
                      Make Admin
                    </button>
                  ) : row.status === "PENDING" ? (
                    <>
                      <button
                        onClick={() => handleApprove(row.user_id)}
                        className="px-3 py-1 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg shadow hover:scale-105 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(row.user_id)}
                        className="px-3 py-1 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-lg shadow hover:scale-105 transition"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-500">{row.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Fragment>
      <div className="min-h-screen flex bg-gradient-to-br from-gray-100 via-purple-100 to-indigo-100">
        {/* Sidebar */}
        <div className="w-64 bg-white/90 backdrop-blur-lg shadow-xl flex flex-col p-6">
          <h1 className="text-2xl font-extrabold text-gray-800 mb-22 text-center drop-shadow">
          </h1>
          <button
            onClick={() => setActiveTab("user")}
            className={`w-full text-left px-4 py-2 rounded-lg mb-3 font-semibold transition ${
              activeTab === "user"
                ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            👤 Users
          </button>
          <button
            onClick={() => setActiveTab("therapist")}
            className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === "therapist"
                ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            🩺 Therapists
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-10 overflow-y-auto">
          {activeTab === "user" && (
            <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-lg shadow-xl hover:shadow-2xl transition">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">👤 Users</h2>
              {renderTable(user, "user")}
            </div>
          )}

          {activeTab === "therapist" && (
            <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-lg shadow-xl hover:shadow-2xl transition">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">🩺 Therapists</h2>
              {renderTable(therapist, "therapist")}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};
