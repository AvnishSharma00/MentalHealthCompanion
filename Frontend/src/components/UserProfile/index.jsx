import { Fragment, useEffect, useState } from "react";
import { userDetail } from "../../Api/userApi"; // assuming updateUser API exists
import { profilePicture } from "../../Api/therapistApi";

import { updateUser } from "../../Api/userApi";

export const UserProfile = () => {
    const [user, setUser] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploadMessage, setUploadMessage] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [updatedUsername, setUpdatedUsername] = useState("");
    const [updatedDob, setUpdatedDob] = useState("");



    const getData = async () => {
        try {
            const response = await userDetail();
            setUser(response);
            setUpdatedUsername(response.username || "");
            setUpdatedDob(response.dateOfBirth || "");
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getData();
    }, []);

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
            await profilePicture(formData);
            setUploadMessage("✅ Photo uploaded successfully");
            setSelectedFile(null);
            getData();
        } catch (err) {
            console.error(err);
            setUploadMessage("❌ Failed to upload photo");
        }
    };

    const handleSave = async () => {
        const data = {
            username: updatedUsername,
            dateOfBirth: updatedDob
        }

        try {
            await updateUser(data);
            setEditMode(false);
            getData();
        } catch (err) {
            console.error(err);
            alert("Failed to update profile");
        }
    };

    return (
        <Fragment>
            <div className="px-4 py-10 bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 ">
                <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-8 flex flex-col md:flex-row gap-10 transition-all duration-300 hover:shadow-2xl">

                    {/* Left: Profile photo + upload */}
                    <div className="flex-shrink-0 flex flex-col items-center">
                        <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-indigo-400 bg-gradient-to-tr from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center shadow-lg transition-transform transform hover:scale-110">
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            ) : user.imageUrl ? (
                                <img
                                    src={`http://localhost:8080${user.imageUrl}?t=${new Date().getTime()}`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-6xl font-bold text-white">
                                    {user.username?.[0]?.toUpperCase()}
                                </span>
                            )}
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            id="fileInput"
                            className="hidden"
                        />

                        <div className="mt-5 flex flex-col gap-3 w-full">
                            <button
                                className="w-full py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                                onClick={() => document.getElementById("fileInput").click()}
                            >
                                {user.imageUrl ? "Change Photo" : "Add Photo"}
                            </button>

                            {selectedFile && (
                                <button
                                    className="w-full py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-semibold shadow-md hover:shadow-lg transition-all"
                                    onClick={handleUpload}
                                >
                                    Upload
                                </button>
                            )}

                            {uploadMessage && (
                                <p className="text-sm text-gray-700 mt-1 text-center">{uploadMessage}</p>
                            )}
                        </div>
                    </div>

                    {/* Right: User info */}
                    <div className="flex-1 backdrop-blur-md bg-white/80 rounded-2xl p-6 flex flex-col justify-center gap-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-extrabold text-indigo-700 tracking-wide">
                                Profile Info
                            </h2>
                            <button
                                className="px-4 py-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium"
                                onClick={() => setEditMode(!editMode)}
                            >
                                {editMode ? "Cancel" : "Edit"}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                            <div>
                                <p className="text-sm font-semibold text-gray-500">Email</p>
                                <p className="text-lg text-gray-800">{user.email}</p>
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-gray-500">Username</p>
                                {editMode ? (
                                    <input
                                        type="text"
                                        value={updatedUsername}
                                        onChange={(e) => setUpdatedUsername(e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2 text-gray-800 focus:ring focus:ring-indigo-300"
                                    />
                                ) : (
                                    <p className="text-lg text-gray-800">{user.username}</p>
                                )}
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-gray-500">Date of Birth</p>
                                {editMode ? (
                                    <input
                                        type="date"
                                        value={updatedDob}
                                        onChange={(e) => setUpdatedDob(e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2 text-gray-800 focus:ring focus:ring-indigo-300"
                                    />
                                ) : (
                                    <p className="text-lg text-gray-800">
                                        {user.dateOfBirth
                                            ? new Date(user.dateOfBirth).toLocaleDateString()
                                            : "Not set"}
                                    </p>
                                )}
                            </div>

                            {user.gender && (
                                <div>
                                    <p className="text-sm font-semibold text-gray-500">Gender</p>
                                    <p className="text-lg text-gray-800">{user.gender}</p>
                                </div>
                            )}

                            <div>
                                <p className="text-sm font-semibold text-gray-500">Joined</p>
                                <p className="text-lg text-gray-800">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {editMode && (
                            <div className="mt-4">
                                <button
                                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all"
                                    onClick={handleSave}
                                >
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Fragment>
    );
};
