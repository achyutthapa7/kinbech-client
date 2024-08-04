import React, { useState } from "react";

const Updatepassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdatePassword = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PRODUCTION_URL}/updateuserpassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ currentPassword, newPassword }),
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        setMessage("Password updated successfully.");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Error updating password.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Update Password</h2>
      <input
        type="password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="border border-gray-300 p-2 rounded mb-4 w-64"
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="border border-gray-300 p-2 rounded mb-4 w-64"
      />
      <button
        onClick={handleUpdatePassword}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Update Password
      </button>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
};

export default Updatepassword;
