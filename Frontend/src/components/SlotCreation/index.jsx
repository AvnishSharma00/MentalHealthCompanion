import { Fragment, useState } from "react";
import { setAvailability } from "../../Api/therapistApi";
import { useTherapist } from "../../context/therapist-context";

export const TherapistAvailabilityForm = () => {
  const { date, startTime, endTime, therapistDispatch } = useTherapist();
  const today = new Date().toISOString().split("T")[0];
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (type) => (e) => {
    therapistDispatch({ type, payload: e.target.value });
  };

  const dataforBackend = {
    date,
    startTime,
    endTime,
  };

  const onSetClick = async () => {
    setError("");
    setSuccess("");
    try {
      const data = await setAvailability(dataforBackend);
      console.log(data);
      setSuccess("Availability set successfully.");
    } catch (err) {
      console.error(err);
      // backend sends {message, code}? adjust accordingly
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to set availability";
      setError(msg);
    }
  };

  return (
    <Fragment>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">Therapist Availability</h2>

        {/* Error or Success message */}
        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded-lg">
            {success}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Date Input */}
          <div className="flex flex-col w-full lg:w-1/3">
            <label className="mb-2 font-medium">Date</label>
            <input
              type="date"
              min={today}
              value={date}
              onChange={handleChange("DATE")}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Start Time Input */}
          <div className="flex flex-col w-full lg:w-1/3">
            <label className="mb-2 font-medium">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={handleChange("START")}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* End Time Input */}
          <div className="flex flex-col w-full lg:w-1/3">
            <label className="mb-2 font-medium">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={handleChange("END")}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={onSetClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow"
          >
            Set Availability
          </button>
        </div>
      </div>
    </Fragment>
  );
};
