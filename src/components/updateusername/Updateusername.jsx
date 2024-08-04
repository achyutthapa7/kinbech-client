import React, { useState } from "react";
import { useUser } from "../../context/User";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Updateusername = () => {
  const [newUserName, setNewUserName] = useState("");
  const [userInfo, setUserInfo] = useUser();
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(false);
  const handleUpdateUsername = async () => {
    setUpdating(true);
    if (newUserName) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_PRODUCTION_URL}/updateusername`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ newUserName }),
            credentials: "include",
          }
        );
        const data = await response.json();
        if (response.status === 200) {
          navigate("/");
          toast.success("Username updated successfully.");
          setUserInfo({ ...userInfo, userDetails: data.user });
          setUpdating(false);
        } else {
          toast.error(data.message);
          setUpdating(false);
        }
      } catch (error) {
        toast.error("Error updating username.");
        setUpdating(false);
      } finally {
        setUpdating(false);
      }
    } else {
      toast.error("cannot leave space");
      setUpdating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Update Username</h2>
      <input
        type="text"
        placeholder="New Username"
        value={newUserName}
        onChange={(e) => setNewUserName(e.target.value)}
        className="border border-gray-300 p-2 rounded mb-4 w-64"
      />
      <button
        disabled={updating}
        onClick={handleUpdateUsername}
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
      >
        {updating ? "updating..." : "Update Username"}
      </button>
    </div>
  );
};

export default Updateusername;
