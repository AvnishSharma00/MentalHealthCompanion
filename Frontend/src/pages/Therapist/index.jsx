import { useEffect, useState, Fragment } from "react";
import { getAllTherapist } from "../../Api/AdminApi";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";

export const Therapist = () => {
  const [therapists, setTherapists] = useState([]);
  const navigate = useNavigate();

  const getAllTherapistFromBackend = async () => {
    try {
      const response = await getAllTherapist();
      setTherapists(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAllTherapistFromBackend();
  }, []);

  return (
    <Fragment>
      
      <h1 className="text-2xl font-bold mb-4 text-center">Available Therapists</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {therapists?.length > 0 ? (
          therapists.map((therapist) => (
            <div
              key={therapist.user_id}
              className="bg-white shadow-md rounded-2xl p-6 border hover:shadow-lg transition flex flex-col items-center cursor-pointer"
              onClick={() => navigate(`/therapists/${therapist.user_id}`)}
            >
              <div className="w-24 h-24 rounded-full overflow-hidden border mb-4 flex items-center justify-center bg-gray-200">
                {therapist.imageUrl ? (
                  <img
                    src={`http://localhost:8080${therapist.imageUrl}`}
                    alt={therapist.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-white">U</span>
                )}
              </div>
              <h2 className="text-xl font-semibold mb-2">{therapist.username}</h2>
              <p className="text-gray-600">📧 {therapist.email}</p>
              <p className="text-gray-600">🎓 {therapist.specialization}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No therapists available
          </p>
        )}
      </div>
    
    </Fragment>
  );
};
