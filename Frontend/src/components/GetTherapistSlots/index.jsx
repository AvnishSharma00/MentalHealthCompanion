import { useEffect, useState } from "react";
import { getAvailability } from "../../Api/therapistApi";
import { Clock, CalendarDays } from "lucide-react"; // icons

export const GetTherapistSlots = () => {
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState("");

  const getSlotss = async () => {
    setError("");
    try {
      const response = await getAvailability();
      setSlots(response); // adjust if API returns {data: [...]}
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch slots";
      setError(msg);
    }
  };

  useEffect(() => {
    getSlotss();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold mb-6 text-gray-900">
        Your Available Slots
      </h2>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* Empty state */}
      {slots.length === 0 && !error ? (
        <div className="p-6 text-center text-gray-500 border border-dashed rounded-xl bg-white shadow-sm">
          No slots available yet.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {slots.map((slot, index) => (
            <div
              key={index}
              className={`rounded-xl border shadow-sm p-5 transition-all ${
                slot.isBooked
                  ? "bg-gray-100 border-gray-300 text-gray-500"
                  : "bg-white border-gray-200 hover:shadow-md hover:-translate-y-1"
              }`}
            >
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <CalendarDays className="w-4 h-4 text-indigo-500" />
                {new Date(slot.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>

              <div className="flex items-center gap-2 text-lg font-semibold">
                <Clock className="w-5 h-5 text-indigo-600" />
                {slot.startTime.slice(0, 5)} – {slot.endTime.slice(0, 5)}
              </div>

              {/* Booked status */}
              {slot.isBooked && (
                <p className="mt-3 text-sm font-semibold text-red-600">
                  Booked
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
