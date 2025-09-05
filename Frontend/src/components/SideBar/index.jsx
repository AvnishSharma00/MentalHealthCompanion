import { useState } from "react";
import { TherapistProfile } from "../../Card/ProfileCard";
import { TherapistAvailabilityForm } from "../SlotCreation";
import { GetTherapistSlots } from "../GetTherapistSlots";
import { GetAppointment } from "../AppointmentsForTherapist";

export const Sidebar = () => {
  const [active, setActive] = useState("profile");

  // dummy components for now
 

  const CreateSlot = () => (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Create Slot</h2>
      <p>This is the slot creation section.</p>
    </div>
  );

  const Logout = () => (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Logout</h2>
      <p>Here you can log out of your account.</p>
    </div>
  );

  const renderContent = () => {
    switch (active) {
      case "profile":
        return( 
          <>
          <TherapistProfile />
          <GetAppointment/>
          </>
        )
      case "createSlot":
        return(
        <div>
          <TherapistAvailabilityForm/>;
          <GetTherapistSlots/>
        </div> 
        )
      case "logout":
        return <Logout />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="flex flex-1">
      {/* Sidebar */}
      <div className="w-64 bg-white text-gray-900 flex flex-col shadow-md">
        <h1 className="text-2xl font-bold p-6 border-b border-gray-200">
          Therapist
        </h1>

        <button
          onClick={() => setActive("profile")}
          className={`p-4 text-left rounded-md transition ${
            active === "profile"
              ? "bg-indigo-600 text-white"
              : "hover:bg-indigo-100 hover:text-indigo-600"
          }`}
        >
          Profile
        </button>

        <button
          onClick={() => setActive("createSlot")}
          className={`p-4 text-left rounded-md transition ${
            active === "createSlot"
              ? "bg-indigo-600 text-white"
              : "hover:bg-indigo-100 hover:text-indigo-600"
          }`}
        >
          Create Slot
        </button>

        <button
          onClick={() => setActive("logout")}
          className={`p-4 text-left rounded-md transition ${
            active === "logout"
              ? "bg-indigo-600 text-white"
              : "hover:bg-indigo-100 hover:text-indigo-600"
          }`}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">{renderContent()}</div>
    </div>
  );
};
