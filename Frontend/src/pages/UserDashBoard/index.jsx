
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import {
  Calendar,
  Clock,
  XCircle,
  CheckCircle2,
  Loader2,
  User,
} from "lucide-react";
import dayjs from "dayjs";
import { useLogin } from "../../context/login-context";

export const UserAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { role } = useLogin();

  // Only fetch if role is USER
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8080/Therapy/appointmentList`,
        {
          withCredentials: true,
        }
      );
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "USER") {
      fetchAppointments();
    } else {
      setLoading(false); // stop spinner if not user
    }
  }, [role]);

  const handleCancel = async (appointmentId) => {
    try {
      await axios.put(
        `http://localhost:8080/Therapy/appointments/${appointmentId}/cancel`,
        {},
        { withCredentials: true }
      );
      fetchAppointments();
    } catch (err) {
      console.error("Error cancelling appointment", err);
      alert("Failed to cancel appointment");
    }
  };

  const groupAppointments = () => {
    const today = dayjs().startOf("day");
    const tomorrow = today.add(1, "day");
    const yesterday = today.subtract(1, "day");

    const groups = {
      Today: [],
      Tomorrow: [],
      Yesterday: [],
      Upcoming: [],
      Past: [],
    };

    appointments.forEach((appt) => {
      const apptDate = dayjs(appt.date);
      if (apptDate.isSame(today, "day")) groups.Today.push(appt);
      else if (apptDate.isSame(tomorrow, "day")) groups.Tomorrow.push(appt);
      else if (apptDate.isSame(yesterday, "day")) groups.Yesterday.push(appt);
      else if (apptDate.isAfter(today, "day")) groups.Upcoming.push(appt);
      else groups.Past.push(appt);
    });
    return groups;
  };

  const statusColors = {
    REQUESTED: "bg-gradient-to-r from-blue-400 to-blue-600",
    APPROVED: "bg-gradient-to-r from-green-400 to-green-600",
    REJECTED: "bg-gradient-to-r from-gray-400 to-gray-600",
    CANCELLED: "bg-gradient-to-r from-red-400 to-red-600",
  };

  const renderAppointmentCard = (appt, isLast) => (
    <div
      key={appt.appointmentId}
      className="relative flex flex-col md:flex-row items-start md:items-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border-l-8 border-transparent"
    >
      <div
        className={`absolute left-0 top-0 h-full w-1 rounded-tr-xl rounded-br-xl ${statusColors[appt.status]}`}
      ></div>

      <div className="flex-1 ml-4 space-y-2">
        <div className="flex items-center gap-2 text-indigo-600 font-semibold">
          <User className="w-5 h-5" />
          <span>{appt.therapistName}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <Calendar className="w-5 h-5 text-indigo-500" />
          <span>{dayjs(appt.date).format("ddd, MMM D, YYYY")}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Clock className="w-5 h-5 text-purple-500" />
          <span>
            {appt.startTime} - {appt.endTime}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {appt.status === "REQUESTED" && (
            <span className="flex items-center text-blue-600 font-semibold">
              <Loader2 className="w-4 h-4 mr-1 animate-spin" /> Requested
            </span>
          )}
          {appt.status === "APPROVED" && (
            <span className="flex items-center text-green-600 font-semibold">
              <CheckCircle2 className="w-4 h-4 mr-1" /> Approved
            </span>
          )}
          {appt.status === "REJECTED" && (
            <span className="flex items-center text-gray-500 font-semibold">
              <XCircle className="w-4 h-4 mr-1" /> Rejected
            </span>
          )}
          {appt.status === "CANCELLED" && (
            <span className="flex items-center text-red-500 font-semibold">
              <XCircle className="w-4 h-4 mr-1" /> Cancelled
            </span>
          )}
        </div>
      </div>

      {appt.status === "REQUESTED" && (
        <button
          onClick={() => handleCancel(appt.appointmentId)}
          className="mt-4 md:mt-0 md:ml-6 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-xl transition-all shadow"
        >
          <XCircle className="w-4 h-4" /> Cancel
        </button>
      )}
      {!isLast && (
        <span className="absolute left-1.5 top-full h-10 w-0.5 bg-gray-300"></span>
      )}
    </div>
  );

  const groups = groupAppointments();

  // Render nothing if not a USER
  if (role !== "USER") return null;

  return (
    <Fragment>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
        My Appointments
      </h2>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-gray-500 w-10 h-10" />
        </div>
      ) : appointments.length === 0 ? (
        <p className="text-gray-400 text-center text-lg">
          No appointments found.
        </p>
      ) : (
        <div className="space-y-12">
          {Object.entries(groups).map(
            ([title, list]) =>
              list.length > 0 && (
                <div key={title}>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 border-indigo-300">
                    {title}
                  </h3>

                  <div className="relative space-y-6 md:space-y-0 md:grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                    {list.map((appt, idx) =>
                      renderAppointmentCard(appt, idx === list.length - 1)
                    )}
                  </div>
                </div>
              )
          )}
        </div>
      )}
    </Fragment>
  );
};
