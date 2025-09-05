import { useParams } from "react-router-dom";
import { useEffect, useState, Fragment } from "react";
import { getTherapistById, getTherapistAvailabilityById, bookAppointment } from "../../Api/therapistApi";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { CalendarDays, Clock } from "lucide-react";

export const TherapistDetails = () => {
  const { id } = useParams();
  const [therapist, setTherapist] = useState(null);
  const [slots, setSlots] = useState([]);

  // Reusable fetch function
  const fetchData = async () => {
    try {
      const t = await getTherapistById(id);
      setTherapist(t);

      const s = await getTherapistAvailabilityById(id);
      setSlots(s);
    } catch (err) {
      console.error("Error fetching therapist details or slots:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleBookSlot = async (slot) => {
    console.log("Booking slot:", slot);
    try {
      await bookAppointment({ availabilityId: slot.slotId });
      await fetchData(); // refresh slots after booking
    } catch (err) {
      console.error("Booking failed:", err);
    }
  };

  if (!therapist) return <p className="text-center mt-10">Loading...</p>;

  return (
    <Fragment>
     

      <div className="max-w-4xl mx-auto p-6">
        {/* Profile */}
        <div className="bg-white shadow-md rounded-2xl p-6 flex gap-6 mb-8">
          <div className="w-32 h-32 rounded-full overflow-hidden border bg-gray-200 flex-shrink-0">
            {therapist.imageUrl ? (
              <img
                src={`http://localhost:8080${therapist.imageUrl}`}
                alt={therapist.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl font-bold text-white flex items-center justify-center w-full h-full">
                U
              </span>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{therapist.username}</h2>
            <p className="text-gray-600">📧 {therapist.email}</p>
            <p className="text-gray-600">🎓 {therapist.qualification}</p>
            <p className="text-gray-600">⚕️ {therapist.specialization}</p>
            <p className="text-gray-600">📞 {therapist.contactNumber}</p>
            <p className="text-gray-600">🔖 License: {therapist.licenseNumber}</p>
          </div>
        </div>

        {/* Slots */}
        <h3 className="text-xl font-semibold mb-4">Available Slots</h3>
        {slots.length === 0 ? (
          <p className="text-gray-500">No slots available</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {slots.map((slot, idx) => (
              <div
                key={idx}
                className={`rounded-xl border p-5 shadow-sm flex flex-col justify-between ${
                  slot.isBooked ? "bg-gray-100 text-gray-500" : "bg-white"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <CalendarDays className="w-4 h-4 text-indigo-500" />
                    {new Date(slot.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    {slot.startTime.slice(0, 5)} – {slot.endTime.slice(0, 5)}
                  </div>
                  {slot.isBooked && (
                    <p className="mt-2 text-sm font-semibold text-red-600">
                      Booked
                    </p>
                  )}
                </div>

                {/* Book Slot Button */}
                {!slot.isBooked && (
                  <button
                    onClick={() => handleBookSlot(slot)}
                    className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition"
                  >
                    Book Slot
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    
    </Fragment>
  );
};
