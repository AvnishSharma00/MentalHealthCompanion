import { Fragment, useEffect, useState } from "react";
import axios from "axios";

export const GetAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const statusOptions = ["REQUESTED", "APPROVED", "REJECTED", "CANCELLED"];

  const fetchAppointments = async (status) => {
    try {
      const res = await axios.get("http://localhost:8080/Therapist/appointmentList", {
        params: status !== "ALL" ? { status } : {},
        withCredentials: true,
      });

      const sorted = res.data.sort(
        (a, b) => new Date(b.requestedAt) - new Date(a.requestedAt)
      );
      setAppointments(sorted);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  useEffect(() => {
    fetchAppointments(statusFilter);
  }, [statusFilter]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const categorizedAppointments = { Today: [], Tomorrow: [], Upcoming: [], Older: [] };
  appointments.forEach((appt) => {
    const apptDate = new Date(appt.date);
    apptDate.setHours(0, 0, 0, 0);

    if (apptDate.getTime() === today.getTime()) categorizedAppointments.Today.push(appt);
    else if (apptDate.getTime() === today.getTime() + 86400000) categorizedAppointments.Tomorrow.push(appt);
    else if (apptDate > today) categorizedAppointments.Upcoming.push(appt);
    else categorizedAppointments.Older.push(appt);
  });

  const handleApprove = async (id) => {
  
    

    try {
     const{data}= await axios.put(`http://localhost:8080/Therapist/appointments/${id}/status`, { status: "APPROVED"}, {
         headers: { "Content-Type": "application/json" },
         withCredentials: true
         });
         console.log(data)
      fetchAppointments(statusFilter);
    } catch (err) {
      console.error("Approve failed:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      const{data}= await axios.put(`http://localhost:8080/Therapist/appointments/${id}/status`, {status: "REJECTED"}, { 
         headers: { "Content-Type": "application/json" },
        withCredentials: true }
      );
      console.log(data)
      fetchAppointments(statusFilter);
    } catch (err) {
      console.error("Reject failed:", err);
    }
  };

  const statusColors = {
    REQUESTED: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-100 text-gray-800",
  };

  const formatDate = (dateStr) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const renderAppointment = (appt) => {
    const apptDate = new Date(appt.date);
    apptDate.setHours(0, 0, 0, 0);
    const allowActions = appt.status === "REQUESTED" && apptDate >= today;

    return (
      <div
        key={appt.appointmentId}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-white via-indigo-50 to-white p-6 rounded-2xl shadow-md hover:shadow-2xl transition duration-300 border border-gray-100"
      >
        <div className="flex flex-col sm:flex-row sm:gap-12 w-full sm:w-auto">
          <div className="text-gray-900 font-bold text-xl">{appt.userName}</div>
          <div className="text-gray-600 font-medium mt-1 sm:mt-0">
            {formatDate(appt.date)} | {appt.startTime} - {appt.endTime}
          </div>
          <span className={`mt-3 sm:mt-0 px-4 py-1 rounded-full text-sm font-semibold ${statusColors[appt.status]}`}>
            {appt.status}
          </span>
        </div>

        {allowActions && (
          <div className="flex gap-4 mt-4 sm:mt-0">
            <button
              onClick={() => handleApprove(appt.appointmentId)}
              className="px-6 py-2 bg-green-600 text-white font-semibold rounded-xl shadow hover:bg-green-700 hover:shadow-lg transition duration-300"
            >
              Approve
            </button>
            <button
              onClick={() => handleReject(appt.appointmentId)}
              className="px-6 py-2 bg-red-600 text-white font-semibold rounded-xl shadow hover:bg-red-700 hover:shadow-lg transition duration-300"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <Fragment>
      <div className="max-w-6xl mx-auto p-10 space-y-10">
        <div className="flex items-center gap-5 mb-8">
          <label className="font-semibold text-gray-700 text-lg">Filter by Status:</label>
          <select
            className="border border-gray-300 px-5 py-2 rounded-lg shadow-sm hover:shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">ALL</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {Object.entries(categorizedAppointments).map(([category, list]) => {
          if (!list.length) return null;
          return (
            <div key={category}>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b-2 border-indigo-300 pb-2">
                {category}
              </h2>
              <div className="flex flex-col gap-6">
                {list.map(renderAppointment)}
              </div>
            </div>
          );
        })}

        {!appointments.length && (
          <p className="text-center text-gray-400 text-xl mt-24">No appointments available</p>
        )}
      </div>
    </Fragment>
  );
};
