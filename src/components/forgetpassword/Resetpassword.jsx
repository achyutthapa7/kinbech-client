import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const Resetpassword = () => {
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_PRODUCTION_URL}/resetpassword`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            newPassword: newPassword,
            confirmNewPassword: confirmPassword,
          }),
        }
      );
      const data = await res.json();
      if (res.status === 200) {
        toast.success(data.message);
        navigate("/");
      } else if (res.status === 403) {
        toast.error(data.message);
      } else if (res.status === 404) {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
        <div className="mb-4">
          <label className="block text-gray-700">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-2 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter new password"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-2 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm new password"
          />
        </div>
        <button
          onClick={handleResetPassword}
          disabled={loading}
          className={`w-full py-2 px-4 text-white font-semibold rounded ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Loading..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
};

export default Resetpassword;
