import { Fragment, useEffect, useState } from "react";
import { getTherapistData } from "../../Api/AdminApi";
import { profilePicture } from "../../Api/therapistApi"; // assume this API exists

export const TherapistProfile = () => {
  const [user, setUser] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  const getData = async () => {
    try {
      const response = await getTherapistData();
      setUser(response);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Preview selected image
  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMessage("Please select a file first");
      return;
    }
    const formData = new FormData();
    formData.append("imageFile", selectedFile);
    try {
      const res = await profilePicture(formData); // call backend API
      setUploadMessage(res);
      setSelectedFile(null);
      getData(); // refresh user data
    } catch (err) {
      console.error(err);
      setUploadMessage("Failed to upload photo");
    }
  };

  return (
    <Fragment>
      <div className="px-4 py-6 md:px-6 md:py-8">
        <div className="max-w-5xl mx-auto bg-white shadow-md rounded-2xl p-6 flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Left side: Profile photo + upload */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="w-40 h-40 rounded-xl overflow-hidden border flex items-center justify-center bg-gray-200">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : user.imageUrl ? (
                <img
                  src={`http://localhost:8080${user.imageUrl}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-5xl font-bold text-white">U</span>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="fileInput"
              className="hidden"
            />

            <div className="mt-4 flex flex-col gap-2 w-full">
              <button
                className={`w-full py-2 rounded-lg shadow text-sm ${
                  user.imageUrl
                    ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
                onClick={() => document.getElementById("fileInput").click()}
              >
                {user.imageUrl ? "Change Photo" : "Add Photo"}
              </button>
              {selectedFile && (
                <button
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow"
                  onClick={handleUpload}
                >
                  Upload
                </button>
              )}
              {uploadMessage && (
                <p className="text-sm text-gray-500 mt-1 text-center">{uploadMessage}</p>
              )}
            </div>
          </div>

          {/* Right side: Info */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <p className="text-sm font-semibold text-gray-500">Username</p>
                <p className="text-lg">{user.username}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Email</p>
                <p className="text-lg">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Specialization</p>
                <p className="text-lg">{user.specialization}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Contact</p>
                <p className="text-lg">{user.contactNumber}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">License No</p>
                <p className="text-lg">{user.licenseNumber}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Qualification</p>
                <p className="text-lg">{user.qualification}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
